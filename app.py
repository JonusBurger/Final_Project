from flask import Flask, render_template

# Configure application
app = Flask(__name__, template_folder='templates')

@app.route("/")
def hello():
    return render_template("index.html")