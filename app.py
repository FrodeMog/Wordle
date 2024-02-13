from flask import Flask, render_template
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect
import random
import os

app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'words.db')
db = SQLAlchemy(app)

class Word(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(80), unique=True, nullable=False)

class ValidInputWord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(100), unique=True)

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