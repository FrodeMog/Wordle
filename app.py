from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired
from sqlalchemy import inspect
from wtforms.validators import DataRequired, EqualTo
import random
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'test1234'

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'words.db')
db = SQLAlchemy(app)

class Word(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(80), unique=True, nullable=False)

class ValidInputWord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(100), unique=True)

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')

@app.route('/', methods=['GET', 'POST'])
def index():
    login_form = LoginForm()
    register_form = RegistrationForm()
    return render_template('index.html', login_form=login_form, register_form=register_form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        # Here you should add the logic to create the new user
        # For example, you might add the new user to your database
        return redirect(url_for('login'))
    return render_template('register.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    form = LoginForm()
    if form.validate_on_submit():
        username = "test"
        password = "test"
        if form.username.data == username and form.password.data == password:
            session['username'] = form.username.data
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
    # Create an inspector
    inspector = inspect(db.engine)

    # Check if the words table exists
    if 'word' not in inspector.get_table_names():
        # Create the database and the words table
        db.create_all()

        # Insert words into the table
        with open('words.txt', 'r') as file:
            for word in file.read().split():
                if not Word.query.filter_by(word=word).first():
                    db.session.add(Word(word=word))

    # Check if the valid_input_word table exists
    if 'valid_input_word' not in inspector.get_table_names():
        # Insert words into the table
        with open('ValidInputWords.txt', 'r') as file:
            for word in file.read().split():
                if not ValidInputWord.query.filter_by(word=word).first():
                    db.session.add(ValidInputWord(word=word))
    

    # Commit the changes
    db.session.commit()

    # Query the database and get all words
    words = Word.query.all()

    # Pass the words to the template
    return render_template('index.html', words=words)

if __name__ == '__main__':
    app.run(debug=True)