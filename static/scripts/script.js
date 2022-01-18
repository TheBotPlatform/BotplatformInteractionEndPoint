const msgerForm = document.querySelector(".msger-inputarea");
const msgerInput = document.querySelector(".msger-input");
const msgerChat = document.querySelector(".msger-chat");

msgerForm.addEventListener("submit", event => {
    event.preventDefault();

    const msgText = msgerInput.value;
    if (!msgText) return;

    appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
    msgerInput.value = "";
    botResponse(msgText);
});

function appendMessage(name, img, side, text, buttons = "", isCarousel = false) {
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
    setTimeout(function() {

        if (isCarousel) {
            $(msgerChat).find('.carousel-container:not(.carousel-rendered)').each(function() {
                var parent = $(this);
                var carousel = $(this).find('.carousel');

                var carouselSettings = {
                    count: carousel.find('.card').length,
                    active: 0,
                    leftButton: parent.find('.carousel-control-left'),
                    rightButton: parent.find('.carousel-control-right')
                }
                if (carouselSettings.count > 1) {
                    carouselSettings.rightButton.addClass('enabled').removeClass('disabled');
                }
                carouselSettings.leftButton.click(function() {
                    if ($(this).hasClass('disabled')) {
                        return;
                    }

                    carouselSettings.active--;
                    parent.animate({ scrollLeft: carousel.find('.card:nth-child(' + (carouselSettings.active + 1) + ')').position().left + parent[0].scrollLeft - 15 })

                    carouselSettings.rightButton.removeClass('disabled').addClass('enabled');
                    if (carouselSettings.active == 0) {
                        carouselSettings.leftButton.removeClass('enabled').addClass('disabled');
                    }
                });
                carouselSettings.rightButton.click(function() {
                    if ($(this).hasClass('disabled')) {
                        return;
                    }
                    carouselSettings.active++;
                    parent.animate({ scrollLeft: carousel.find('.card:nth-child(' + (carouselSettings.active + 1) + ')').position().left + parent[0].scrollLeft - 15 })

                    carouselSettings.leftButton.removeClass('disabled').addClass('enabled');
                    if (carouselSettings.active >= carouselSettings.count - 1) {
                        carouselSettings.rightButton.removeClass('enabled').addClass('disabled');
                    }
                })

                parent.addClass('carousel-rendered')
            })();

        }
    }, 10);

    msgerChat.scrollTop += 500;
}


function buttonsHtml(buttons) {
    var html = "";
    for (var j = 0; j < buttons.length; j++) {
        var onclick = "";
        switch (buttons[j].type) {
            case 'open_url':
                onclick = "window.open(\"" + buttons[j].url + "\");"
                break;
            default:
                onclick = "botResponse(\"" + buttons[j].actions[0].id + "\");appendMessage(\"" + PERSON_NAME + "\", \"" + PERSON_IMG + "\", \"right\", \"" + buttons[j].title + "\");";

        }
        if (buttons[j].destroy_all_on_interaction) {
            onclick += "$(this).parent().parent().parent().remove();";
            onclick += "appendMessage(PERSON_NAME, PERSON_IMG, \"right\", \"" + buttons[j].title + "\");"
        }

        var button = "<button onclick='" + onclick + "' class='msg-button'>" + buttons[j].title + "</button>";
        html += button;
    }
    return html;
}

function botResponse(rawText) {
    // Bot Response
    $.getJSON("/get", {
        msg: rawText,
        userID: USER_ID
    }).fail(function() {
        var last = $('.msg').last();
        last.data('rawText', rawText);
        last.addClass('error').click(function() {
            $(this).hide();
            appendMessage(PERSON_NAME, PERSON_IMG, "right", $(this).data('rawText'));
            msgerInput.value = "";
            botResponse($(this).data('rawText'));

        })
    }).done(function(data) {
        $('.msg.error').last().removeClass('error')
        var output = data.data.attributes.output
        const msgText = data;
        for (var i = 0; i < output.length; i++) {
            switch (output[i].type) {
                case 'video':
                    appendMessage(BOT_NAME, BOT_IMG, "left", "<video src='" + output[i].url + "' autoplay controls></video>");
                    break;
                case 'audio':
                    appendMessage(BOT_NAME, BOT_IMG, "left", "<audio src='" + output[i].url + "' autoplay controls></audio>");
                    break;
                case 'image':
                    appendMessage(BOT_NAME, BOT_IMG, "left", "<img src='" + output[i].url + "'/>");
                    break;
                case 'carousel':
                    var html = "<div class='carousel-container'><div class='carousel' style='width:" + output[i].cards.length + "00%'>";
                    for (var j = 0; j < output[i].cards.length; j++) {
                        var card = output[i].cards[j];
                        if (card.subtitle === undefined) {
                            card.subtitle = "";
                        }
                        if (card.title === undefined) {
                            card.title = "";
                        }
                        var buttons = "";
                        if (card.buttons !== undefined && card.buttons.length > 0) {
                            buttons = buttonsHtml(card.buttons);
                        }
                        var img = "<div class='card-image'><img src='" + card.image + "'/></div>"
                        var width = 100 / output[i].cards.length;
                        html += `<div class='card' style='margin-right:1%;width:${width-2}%'>
                                    ${img}
                                    <div class='card-title'>${card.title}</div>
                                    <div class='card-subtitle'>${card.subtitle}</div>
                                    <div class='card-buttons'>${buttons}</div>
                                </div>`
                    }

                    html += `</div>
                                <div class='carousel-controls'><button class='carousel-control carousel-control-left disabled'><i class='fas fa-arrow-left'></i></button><button class='carousel-control carousel-control-right disabled'><i class='fas fa-arrow-right'></i></button></div>
                            </div>`;
                    appendMessage(BOT_NAME, BOT_IMG, "left", html, "", true);
                    break;
                default:
                    var buttons = "";
                    if (output[i].buttons !== undefined && output[i].buttons.length > 0) {
                        buttons = buttonsHtml(output[i].buttons)
                    }
                    appendMessage(BOT_NAME, BOT_IMG, "left", output[i].text, buttons);
            }
        }

    });
}

function setUserId(userId) {
    try {
        window.localStorage.setItem("tbp.userId", userId);
    } catch (e) {

    }
    USER_ID = userId;
}

function createUserIfNotExists(cb) {
    // check if user already exists
    var userId = "";
    try {
        userId = window.localStorage.getItem("tbp.userId");
    } catch (e) {

    }
    if (userId && userId.length > 1 && userId !== "null") {
        setUserId(userId);
        cb();
        return;
    }
    // create a new user
    $.get("/createuser").done(function(data) {
        setUserId(data);
        cb();
    }).fail(function(e) {
        console.log(e.statusText);
        console.log(e);
        alert("error");
    });
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