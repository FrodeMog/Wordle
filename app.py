from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, EqualTo
from werkzeug.security import generate_password_hash, check_password_hash
import random
import os

db = SQLAlchemy()

# Database models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username
    
class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    wins = db.Column(db.Integer, default=0)
    losses = db.Column(db.Integer, default=0)

    def __init__(self, username, wins=0, losses=0):
        self.username = username
        self.wins = wins
        self.losses = losses

class Word(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(80), unique=True, nullable=False)

class ValidInputWord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(100), unique=True)

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'VerySecureHardcodedKey'

    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database.db')

    db.init_app(app)

    with app.app_context():
        db.create_all()

        if not Word.query.first():
            # Insert words into the table
            with open('words.txt', 'r') as file:
                for word in file.read().split():
                    db.session.add(Word(word=word))

        if not ValidInputWord.query.first():
            # Insert words into the table
            with open('ValidInputWords.txt', 'r') as file:
                for word in file.read().split():
                    db.session.add(ValidInputWord(word=word))

        # Commit the changes
        db.session.commit()

    return app

# Create a new instance of the application
app = create_app()

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')

@app.route('/update_score', methods=['POST'])
def update_score():
    data = request.get_json()
    username = data.get('username')
    wins = data.get('wins')
    losses = data.get('losses')

    score = Score.query.filter_by(username=username.lower()).first()
    if score:
        if wins is not None:
            score.wins += wins
        if losses is not None:
            score.losses += losses
    else:
        score = Score(username=username, wins=wins if wins is not None else 0, losses=losses if losses is not None else 0)
        db.session.add(score)
    db.session.commit()
    return jsonify({'message': 'Score updated successfully'}), 200

@app.route('/get_score', methods=['GET'])
def get_score():
    username = request.args.get('username')
    if username:
        score = Score.query.filter_by(username=username.lower()).first()
        if score:
            return jsonify({'wins': score.wins, 'losses': score.losses})
        else:
            return jsonify({'error': 'User not found'}), 404
    else:
        return jsonify({'error': 'Username not provided'}), 400

@app.route('/', methods=['GET', 'POST'])
def index():
    login_form = LoginForm()
    register_form = RegistrationForm()
    return render_template('index.html', login_form=login_form, register_form=register_form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        existing_user = User.query.filter_by(username=form.username.data.lower()).first()
        if existing_user:
            error = 'A user with that username already exists.'
            return render_template('register.html', error=error, form=form)
        hashed_password = generate_password_hash(form.password.data, method='pbkdf2:sha256')
        new_user = User(username=form.username.data.lower(), password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('login'))
    elif form.errors:
        error = list(form.errors.values())[0][0] 
        return render_template('register.html', error=error, form=form)
    return render_template('register.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data.lower()).first()
        if user and check_password_hash(user.password, form.password.data):
            session['username'] = form.username.data.lower()
            return redirect(url_for('home'))
        else:
            error = 'Invalid username or password'
    return render_template('login.html', error=error, form=form)

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))

@app.route('/api/randomWord', methods=['GET'])
def get_word():
    words = Word.query.all()
    words_list = [word.word for word in words]
    testword = random.choice(words_list)
    return jsonify(testword)

@app.route('/api/checkWord/<word>', methods=['GET'])
def check_word(word):
    word_obj = ValidInputWord.query.filter_by(word=word).first()
    return jsonify({'exists': word_obj is not None})

@app.route('/')
def home():
    # Query the database and get all words
    words = Word.query.all()

    # Pass the words to the template
    return render_template('index.html', words=words)

if __name__ == '__main__':
    app.run(debug=True)