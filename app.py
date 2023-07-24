from flask import Flask, render_template, redirect, session, request
from flask_session import Session

# Configure application
app = Flask(__name__, template_folder='templates')

# Configure session
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.route("/")
def main():
    if session.get("user") is None:
        return render_template("index.html")
    else:
        return render_template("index.html", username = session["user"])

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        
        # Forget current name
        session.clear()

        # Remember user
        session["user"] = request.form.get("user")
    return redirect("/")

