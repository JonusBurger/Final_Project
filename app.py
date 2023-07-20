from flask import Flask

# Configure application
app = Flask(__name__)

@app.route("/")
def hello():
    return "hello World!"