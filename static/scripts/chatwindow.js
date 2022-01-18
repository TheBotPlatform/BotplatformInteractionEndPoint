var TBPChatWindow = function(settings) {
    var url = settings.url;

    var widget = {
        frame: $('<iframe id="tbp-web-bot" src="' + url + '"></iframe>'),
        close: $('<div id="tbp-close-chat">X</div>'),
        bubble: $('<div id="tbp-chatbubble"><i class="fas fa-robot"></i></div>')
    };

    widget.bubble.click(function() {
        $('body').addClass("tbp-web-chat-visible");
    });
    widget.close.click(function() {
        $('body').removeClass("tbp-web-chat-visible");
    });

    return {
        init: function() {
            $('body').append(widget.frame).append(widget.close).append(widget.bubble);
        }
    }

}