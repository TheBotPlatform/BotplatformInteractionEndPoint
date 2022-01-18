# Bot Platform Interaction Endpoint Client
A proof of concept bot using the interaction end point

## Chat interface
To use the interaction end point you need a chat interface that you want to integrate with it. In this proof of concept we are using a python based proxy server based from: https://github.com/ahmadfaizalbh/Chatbot

![Screenshot](https://github.com/TheBotPlatform/POCInteractionEndpointPython/raw/main/static/img/screenie.gif)

## Getting started
Once you've cloned the repo, duplicate .env.example as .env and set your client id and secret from The Bot Platform

You will need to set up API access within The Bot Platform.  Select OAuth2 and make sure you copy the Client ID and Client Secret and store them somewhere safe as you will only be able to access the secret once. 

Install the required modules

`pip install request python-decouple`

run `python app.py`

Now visit http://127.0.0.1:5000/example to see it in place

## Standalone chat window

Visit http://127.0.0.1:5000/

To change any of the styling check out the following files:
- [templates/index.html](https://github.com/TheBotPlatform/POCInteractionEndpointPython/blob/main/templates/index.html)
- [static/styles/style.css](https://github.com/TheBotPlatform/POCInteractionEndpointPython/blob/main/static/styles/style.css)
- [static/scripts/scripts.js](https://github.com/TheBotPlatform/POCInteractionEndpointPython/blob/main/static/scripts/script.js)

## Embed

Visit http://127.0.0.1:5000/example to see an example

Include just before your `</head>`

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src='https://use.fontawesome.com/releases/v5.0.13/js/all.js'></script>

<link rel="stylesheet" href="/static/styles/chatwindow.css" />
<script src="/static/scripts/chatwindow.js"></script>
<script>
    $(function() {
        TBPChatWindow({
            url: "/", // where can it access the view of the bot
            welcomeMessage: "__PAYLOAD__START" // this is the welcome message, although you can use @BP:MESSAGE:ID format if you'd prefer or want to choose a specific message to start from
        }).init();
    })
</script>
```

## Supported Message Parts

- Welcome message
- Text
- Buttons
- Quick replies
- Carousels
- Media (Images, GIFs, Videos, Audio)
- Jump
- Attributes
- Webhook posts
- Message variations

## Features NOT supported

- Delays
- Webhook responses
- Broadcasts

## Further reading
- [API Docs](https://drive.google.com/file/d/1XSo1WfToh3tsU4iSulaum64K_dvpudxx/view?usp=sharing)
