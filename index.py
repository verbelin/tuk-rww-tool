from flask import Flask
app = Flask(__name__)

@app.route('/')
def home():
    return "TUK-RWW-Tool läuft!"
