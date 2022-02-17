import { generateName } from './random-names.js';

// Support TLS-specific URLs, when appropriate.
if (window.location.protocol == "https:") {
  var ws_scheme = "wss://";
} else {
  var ws_scheme = "ws://"
};

var handle = generateName();
var room = 'global';

function startChat(room, handle) {
  var inbox = new ReconnectingWebSocket(ws_scheme + location.host + `/receive?room=${room}&handle=${handle}`);
  var outbox = new ReconnectingWebSocket(ws_scheme + location.host + "/submit");

  inbox.onmessage = function(message) {
    var data = JSON.parse(message.data);
    $("#chat-text").append("<div class='logitem'><p class='strangermsg'><strong class='msgsource'>" + $('<span>').text(data.handle + ': ').html() + "</strong><span class='>notranslate'>" + $('<span>').text(data.text).html() + "</span></p></div>");
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
    outbox.send(JSON.stringify({ room: room, handle: handle, text: text }));
    $("#input-text")[0].value = "";
  });
}

console.log(window.atob('TG9vayBhdCB0aGlzLCBhIHNtYWxsIGVhc3RlciBlZ2cuIERpc2NsYWltZXI6IEFib3V0IHRoZSBgU2F5IFNUQU5EIFdJVEggSE9ORyBLT05HIEFHQUlOU1QgVEhFIENDUCFgIHdhcyBqdXN0IGNvcGllZCBmcm9tIE9tZWdsZQ'));
console.log(window.atob('U2l0dWF0aW9uIGFzaWRlLCBJJ20gYWxsIGZvciBmcmVlZG9tLCBzbyBpbiB0aGUgZW5kIEkganVzdCBkZWNpZGVkIHRvIGxlYXZlIGl0Lg'));
console.log(window.atob('SGF2ZSBhIG5pY2UgZGF5IDop'));

function showRoom(roomName) {
  $("#displayroom").append(`You're in <em>${roomName}</em> room`);
}

$("#input-handle")[0].value = handle;

$("#input-login").on("submit", function (event) {
  event.preventDefault();
  let newHandle = $("#input-handle")[0].value;
  let newRoom = $("#input-room")[0].value;

  if (!newHandle) {
    alert('Handle cannot be empty!');
    $("#input-handle")[0].value = generateName();
  } else {
    room = newRoom || room;
    handle = newHandle;
    startChat(room, handle);
    showRoom(room);
    $.modal.close();
  }
});


