# Bot Platform Interaction Endpoint Client
A proof of concept bot using the interaction end point

## Chat interface
To use the interaction end point you need a chat interface that you want to integrate with it. In this proof of concept we are using a python based interface: https://github.com/ahmadfaizalbh/Chatbot

## Getting started
Once you've cloned the repo, duplicate .env.example as .env and set your client id and secret from The Bot Platform
Install the required modules

`pip install request python-decouple`

run `python app.py`

Now visit http://127.0.0.1:5000/example to see it in place

## Standalone chat window

Visit http://127.0.0.1:5000/

To change any of the styling check out the following files:
- templates/index.html
- static/styles/style.css
- static/scripts/scripts.js

## Embed

Visit http://127.0.0.1:5000/example to see an example

Include just before your `</head>`

```html
<link rel="stylesheet" href="{{ url_for('static', filename='styles/chatwindow.css') }}">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src='https://use.fontawesome.com/releases/v5.0.13/js/all.js'></script>
<script src="{{ url_for('static', filename='scripts/chatwindow.js') }}"></script>
<script>
    $(function() {
        TBPChatWindow({
            url: "/" // where can it access the view of the bot
        }).init();
    })
</script>
```


## Further reading
- [API Docs](https://drive.google.com/file/d/1XSo1WfToh3tsU4iSulaum64K_dvpudxx/view?usp=sharing)
- [Tutorial](https://docs.google.com/document/d/1XiUkf4Mbvk55ZbYmewLPsFoFcHiVFmLNQyaXyYskxi4/edit?usp=sharing)
