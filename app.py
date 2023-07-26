from flask import Flask, render_template, redirect, session, request, flash
from flask_session import Session
import json
import sqlite3

# Configure application
app = Flask(__name__, template_folder='templates')

# Configure database
connection = sqlite3.connect("scores.db", check_same_thread=False)
db = connection.cursor()

# Configure session
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# configures main page
@app.route("/")
def main():
    scoreboard = connection.execute("SELECT * FROM score ORDER BY score DESC LIMIT 10;")
    if session.get("user") is None:
        return render_template("index.html", scoreboard = scoreboard)
    else:
        return render_template("index.html", username = session["user"], scoreboard = scoreboard)

# method for saving username in session
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        
        # Forget current name
        session.clear()

        # Remember user
        username = request.form.get("user")
        if not username:
            flash("Enter a Playername!")
            return redirect("/")
        elif len(username) > 15:
            flash("Playername is to long")
            return redirect("/")
        session["user"] = username
    return redirect("/")

# method for storing score of user in scores.db
@app.route("/process/<string:score>", methods=["POST"])
def processInfo(score):
    score = json.loads(score)
    db.execute("INSERT INTO score (user, score) VALUES (?,?);",[session["user"], score])
    connection.commit()
    return f'Score {score} added to database'

@app.route("/change", methods=["POST"])
def name_change():
    session.clear()
    return redirect("/")

