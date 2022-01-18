from thebotplatform import getBotResponse, BearerTokenGrab, CreateUserID
from flask import Flask, render_template, request

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

app.static_folder = 'static'

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/example")
def testexample():
    return render_template("example.html")

@app.route("/createuser")
def create_user():
    bearerToken = BearerTokenGrab()
    return CreateUserID(bearerToken)

@app.route("/get")
def get_bot_response():
    userText = request.args.get('msg')
    UserID = request.args.get('userID')   
    message = getBotResponse(UserID, userText)
    return message
    
if __name__ == "__main__":
    app.run() 
