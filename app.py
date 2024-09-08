from flask import Flask, render_template, request, redirect, session, jsonify, flash
import sqlite3

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Jack'

# Function to connect to the database
def get_db_connection():
    connection = sqlite3.connect('database.db')
    connection.row_factory = sqlite3.Row
    return connection

@app.route('/', methods=('GET', 'POST'))
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute('''SELECT * FROM users WHERE email = ?''', (email,))
        user = cursor.fetchone()

        if user:
            flash('Email address already registered. Please try a different email.', 'error')
            return redirect('/')
        else:
            connection.execute(
                'INSERT INTO users (username, email, password_ash) VALUES (?, ?, ?)', 
                (username, email, password)
            )
            connection.commit()
        connection.close()
        return redirect('/index')
    return render_template('signup.html')

@app.route('/signin', methods=('GET', 'POST'))
def signin():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute('''SELECT * FROM users WHERE email = ?''', (email,))
        user = cursor.fetchone()

        if user:
            if password == user['password_ash']:
                session['user'] = {'user_id': user['user_id'], 'username': user['username'], 'email': user['email']}
                return redirect('/index')
            else:
                flash('Incorrect Password.', 'error')
                return render_template('signin.html')
        else:
            flash('Email not found', 'error')
            return render_template('signin.html')
        
    return render_template('signin.html')

@app.route('/index')
def index():
    if 'user' in session:
        return render_template('index.html')
    else:
        return redirect('/')

@app.route('/save_steps', methods=['POST'])
def save_steps():
    if 'user' not in session:
        return jsonify({'error': 'User not logged in'}), 403
    
    data = request.get_json()
    steps = data.get('steps')

    if steps is None:
        return jsonify({'error': 'Invalid step count'}), 400

    user_id = session['user']['user_id']
    
    connection = get_db_connection()
    connection.execute('INSERT INTO steps (user_id, steps) VALUES (?, ?)', (user_id, steps))
    connection.commit()
    connection.close()

    return jsonify({'success': True, 'steps': steps}), 200
