var USER_ID = false;

msgerForm.addEventListener("submit", event => {
    event.preventDefault();

    const msgText = msgerInput.value;
    if (!msgText) return;

    appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
    msgerInput.value = "";
    botResponse(msgText);
});

function appendMessage(name, img, side, text, buttons = "") {
    if (text === undefined) {
        text = "";
    }
    //   Simple solution for small apps
    const msgHTML = `
      <div class="msg ${side}-msg">
        <div class="msg-img" style="background-image: url(${img})"></div>
        <div class="msg-bubble">
          <div class="msg-info">
            <div class="msg-info-name">${name}</div>
            <div class="msg-info-time">${formatDate(new Date())}</div>
          </div>
          <div class="msg-text">${text}</div>
          <div class="msg-buttons">${buttons}</div>
        </div>
      </div>
      `;
    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
}

function botResponse(rawText) {
    // Bot Response
    $.getJSON("/get", {
        msg: rawText,
        userID: USER_ID
    }).done(function(data) {
        var output = data.data.attributes.output
        const msgText = data;
        for (var i = 0; i < output.length; i++) {
            console.log(output[i]);
            switch (output[i].type) {
                case 'image':
                    appendMessage(BOT_NAME, BOT_IMG, "left", "<img src='" + output[i].url + "'/>");
                    break;
                default:
                    var buttons = "";
                    if (output[i].buttons !== undefined && output[i].buttons.length > 0) {
                        for (var j = 0; j < output[i].buttons.length; j++) {
                            var onclick = "";
                            switch (output[i].buttons[j].type) {
                                case 'open_url':
                                    onclick = "window.open(\"" + output[i].buttons[j].url + "\");"
                                    break;
                                default:
                                    onclick = "botResponse(\"" + output[i].buttons[j].actions[0].id + "\");"
                            }
                            if (output[i].buttons[j].destroy_all_on_interaction) {
                                onclick += "$(this).parent().parent().parent().remove();";
                                onclick += "appendMessage(PERSON_NAME, PERSON_IMG, \"right\", \"" + output[i].buttons[j].title + "\");"
                            }



                            var button = "<button onclick='" + onclick + "' class='msg-button'>" + output[i].buttons[j].title + "</button>";
                            buttons += button;
                        }
                    }
                    appendMessage(BOT_NAME, BOT_IMG, "left", output[i].text, buttons);
            }
        }

    });
}

function setUserId(userId) {
    window.localStorage.setItem("tbp.userId", userId);
    USER_ID = userId;
}

function createUserIfNotExists(cb) {
    // Bot Response

    var userId = window.localStorage.getItem("tbp.userId");
    if (userId.length > 1 && userId !== "null") {
        setUserId(userId);
        cb();
        return;
    }

    $.get("/createuser").done(function(data) {

        setUserId(data);
        cb();
    });
}


// Utils
function get(selector, root = document) {
    return root.querySelector(selector);
}

function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();

    return `${h.slice(-2)}:${m.slice(-2)}`;
}
$(function() {
    createUserIfNotExists(function() {
        botResponse(START_MESSAGE);
    });
});