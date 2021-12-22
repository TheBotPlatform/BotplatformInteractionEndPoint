from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer
from chatterbot.trainers import ChatterBotCorpusTrainer
import requests
import re
import json



# Creating ChatBot Instance - imported machine learning version
"""chatbot = ChatBot(
    'BotPlatform',
    storage_adapter='chatterbot.storage.SQLStorageAdapter',
    logic_adapters=[
        'chatterbot.logic.MathematicalEvaluation',
        'chatterbot.logic.TimeLogicAdapter',
        'chatterbot.logic.BestMatch',
        {
            'import_path': 'chatterbot.logic.BestMatch',
            'default_response': 'I am sorry, but I do not understand. I am still learning.',
            'maximum_similarity_threshold': 0.90
        }
    ],
    database_uri='sqlite:///database.sqlite3'
)

 # Training with Personal Ques & Ans
training_data_quesans = open('training_data/ques_ans.txt').read().splitlines()
training_data_personal = open('training_data/personal_ques.txt').read().splitlines()

training_data = training_data_quesans + training_data_personal

trainer = ListTrainer(chatbot)
trainer.train(training_data)

# Training with English Corpus Data
trainer_corpus = ChatterBotCorpusTrainer(chatbot)
trainer_corpus.train(
    'chatterbot.corpus.english'
)
"""

#Creating and getting my bearer token

def BearerTokenGrab():
    url = "https://api.thebotplatform.com/oauth2/token"
    payload = "client_id=b9c8d325-783b-4031-b759-37f531bd0105&client_secret=VT-Wh8kw35kUaM6e7gTSDRuFtR&grant_type=client_credentials"
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
        }

    response = requests.request("POST", url, data=payload, headers=headers)
    textResponse = response.text
    return textResponse
    print(response.text)

#Splits the result of grabbing my bearer token into an array and grabs the actual token so I can use it
BearerTokenText = BearerTokenGrab()
SplitResultsBearer = [f[1:-1] for f in re.findall('".+?"', BearerTokenText)]
AccessToken = SplitResultsBearer[1]
print("Access Token is: "+AccessToken)

#Creates a User ID for the current user
def CreateUserID():
    url = "https://api.thebotplatform.com/v1.0/interaction/user"
    payload = []
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Bearer "+AccessToken
        }
    userResponse = requests.request("POST", url, data=payload, headers=headers)
    UIDtextResponse = userResponse.text
    return UIDtextResponse

UserIDcontent = CreateUserID()
pattern = 'id'
SplitResultsUserID = re.compile(pattern, re.IGNORECASE)
UserIDArray = []
for match in SplitResultsUserID.finditer(UserIDcontent):
    UserIDArray.append(match.string)

#splits the user ID into a format that can be used for calls
SplitClientID = [f[1:-1] for f in re.findall('".+?"', UserIDArray[0])]
UserID = SplitClientID[6]
print("User ID: "+UserID)


def getWelcomeMsg():
    url = "https://api.thebotplatform.com/v1.0/interaction"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+AccessToken
        }
    payloaddict = { "data": { "type": "interaction", "attributes": { "user": { "id":
UserID }, "input": "__PAYLOAD__START" } } }
    

    r = requests.post(url, headers=headers, json=payloaddict)
    JsonResponse = r.json()
    
    return JsonResponse

Output = getWelcomeMsg()
#print(type(Output))
#print(Output['type'])

for key, value in Output.items() :
    Stroutput = str(value)
    
SplitOutput = [f[1:-1] for f in re.findall('".+?"', Stroutput)]
print(SplitOutput)



#My chatbot code
def LG_chatbot(inputtext):
    if inputtext == "Hi":
        print("Hi detected")
    else:
        print("Please enter Hi to get started")

chatbot = LG_chatbot("Hello")