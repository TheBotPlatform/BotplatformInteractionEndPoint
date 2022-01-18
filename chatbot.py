#from chatterbot import ChatBot
#from chatterbot.trainers import ListTrainer
#from chatterbot.trainers import ChatterBotCorpusTrainer
import requests
import re
import json


#Creating and getting my bearer token

def BearerTokenGrab():
    clientID = "CLIENT_ID"
    clientSecret = "CLIENT_SECRET"
    url = "https://api.thebotplatform.com/oauth2/token"
    payload = "client_id="+clientID+"&client_secret="+clientSecret+"&grant_type=client_credentials"
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
        }

    response = requests.request("POST", url, data=payload, headers=headers)
    textResponse = response.text
    SplitResultsBearer = [f[1:-1] for f in re.findall('".+?"', textResponse)]
    AccessToken = SplitResultsBearer[1]
    return AccessToken
    print(response.text)

#Splits the result of grabbing my bearer token into an array and grabs the actual token so I can use it
#BearerTokenText = BearerTokenGrab()
#SplitResultsBearer = [f[1:-1] for f in re.findall('".+?"', BearerTokenText)]
#AccessToken = SplitResultsBearer[1]

BearerTest = BearerTokenGrab()
print("Access Token is: "+BearerTest)

#Creates a User ID for the current user
def CreateUserID(Token):
    url = "https://api.thebotplatform.com/v1.0/interaction/user"
    payload = []
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Bearer "+Token
        }
    userResponse = requests.request("POST", url, data=payload, headers=headers)
    UIDtextResponse = userResponse.text
    pattern = 'id'
    SplitResultsUserID = re.compile(pattern, re.IGNORECASE)
    UserIDArray = []
    for match in SplitResultsUserID.finditer(UIDtextResponse):
         UserIDArray.append(match.string)

    #splits the user ID into a format that can be used for calls
    SplitClientID = [f[1:-1] for f in re.findall('".+?"', UserIDArray[0])]
    UserID = SplitClientID[6]
    return UserID

UserIDcontent = CreateUserID(BearerTest)
print("User Id is : "+UserIDcontent)


def getWelcomeMsg(UserID):
    url = "https://api.thebotplatform.com/v1.0/interaction"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+BearerTest
        }
    payloaddict = { "data": { "type": "interaction", "attributes": { "user": { "id":
UserID }, "input": "__PAYLOAD__START" } } }
    

    r = requests.post(url, headers=headers, json=payloaddict)
    JsonResponse = r.json()
    formatJsonresp = json.dumps(JsonResponse, indent=4, sort_keys=True)
    responseDict = json.loads(formatJsonresp)
    Actualwelcomemesglist = responseDict['data']['attributes']['output']
    Actualwelcomemesgstring= str(Actualwelcomemesglist)
    WelcomeList = Actualwelcomemesgstring.split("'", 10)
    Welcome_Mesg = WelcomeList[3]
    return Welcome_Mesg

Output = getWelcomeMsg(UserIDcontent)
print(Output)
#print(type(Output))
#print(Output['type'])

"""for key, value in Output.items() :
    Stroutput = str(value)
    print(Stroutput)
    """


"""#My chatbot code
def LG_chatbot(inputtext):
    if inputtext == "Hi":
        print("Hi detected")
    else:
        print("Please enter Hi to get started")

chatbot = LG_chatbot("Hello")"""
