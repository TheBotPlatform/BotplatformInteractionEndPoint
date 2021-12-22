from chatbot import getWelcomeMsg, BearerTokenGrab, CreateUserID
from flask import Flask, render_template, request

app = Flask(__name__)
app.static_folder = 'static'

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get")
def get_bot_response():
    userText = request.args.get('msg')
    if userText == "Hi":
        #print("Hi detected")
        bearerToken = BearerTokenGrab()
        UserID = CreateUserID(bearerToken)
        userText = getWelcomeMsg(UserID)
        return userText
    else:
        #print("Please enter Hi to get started")
        userText = "Please enter Hi to get started"
        return userText
    
    #return str(chatbot.get_response(userText))

if __name__ == "__main__":
    app.run() 
