import requests
import json

from decouple import config
import time

#Creating and getting my bearer token

LastToken = False
LastTokenTime = False
TokenLifespan = 58 * 60

def BearerTokenGrab():
    global LastToken
    global LastTokenTime
    now = time.time()

    if LastToken and LastTokenTime > now - TokenLifespan:
        return LastToken
    
    url = "https://api.thebotplatform.com/oauth2/token"
    payload = "client_id=" + config("TBP_CLIENT_ID") + "&client_secret=" + config("TBP_CLIENT_SECRET") + "&grant_type=client_credentials"
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    response = requests.post(url, data=payload, headers=headers)
    jsonResponse = response.json()
    LastToken = jsonResponse['access_token']
    LastTokenTime = now
    return jsonResponse['access_token']

#Creates a User ID for the current user
def CreateUserID():
    url = "https://api.thebotplatform.com/v1.0/interaction/user"
    payload = []
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Bearer " + BearerTokenGrab()
    }
    response = requests.post(url, data=payload, headers=headers)
    jsonResponse = response.json()   
    return jsonResponse['data']['attributes']['user']['id']

def getBotResponse(UserID, input):
    url = "https://api.thebotplatform.com/v1.0/interaction"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + BearerTokenGrab()
    }
    payloaddict = { "data": { "type": "interaction", "attributes": { "user": { "id": UserID }, "input": input } } }

    response = requests.post(url, headers=headers, json=payloaddict)
    jsonResponse = response.json()
    formatJsonresp = json.dumps(jsonResponse, indent=4, sort_keys=True)
    return formatJsonresp

print("Running the proxy server")