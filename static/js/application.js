import { generateName } from './random-names.js';

// Support TLS-specific URLs, when appropriate.
if (window.location.protocol == "https:") {
  var ws_scheme = "wss://";
} else {
  var ws_scheme = "ws://"
};

var handle = generateName();

var inbox = new ReconnectingWebSocket(ws_scheme + location.host + "/receive");
var outbox = new ReconnectingWebSocket(ws_scheme + location.host + "/submit");


inbox.onmessage = function(message) {
  var data = JSON.parse(message.data);
  $("#chat-text").append("<div class='panel panel-default'><div class='panel-heading'>" + $('<span/>').text(data.handle).html() + "</div><div class='panel-body'>" + $('<span/>').text(data.text).html() + "</div></div>");
  $("#chat-text").stop().animate({
    scrollTop: $('#chat-text')[0].scrollHeight
  }, 800);
};

inbox.onclose = function(){
    console.log('inbox closed');
    this.inbox = new WebSocket(inbox.url);

};

outbox.onclose = function(){
    console.log('outbox closed');
    this.outbox = new WebSocket(outbox.url);
};

$("#input-form").on("submit", function(event) {
  event.preventDefault();
  var text = $("#input-text")[0].value;
  console.log('data', JSON.stringify({ handle: handle, text: text }))
  outbox.send(JSON.stringify({ handle: handle, text: text }));
  $("#input-text")[0].value = "";
});

$("#input-handle")[0].value = handle;

$("#input-login").on("submit", function (event) {
  event.preventDefault();
  let newHandle = $("#input-handle")[0].value;
  let room = $("#input-room")[0].value;

  if (!newHandle) {
    alert('Handle cannot be empty!');
    $("#input-handle")[0].value = generateName();
  } else {
    room = (room) ? room : 'global';
    handle = `${room}@${newHandle}`;
    $.modal.close();
  }
});
