
var cognichatpannel = (function() {
  var settings = {
    selectors: {
      chatBox: '#scrollingChat',
      fromUser: '.usertext',
      fromWatson: '.from-watson',
      latest: '.latest'
    },
    messageSource: {
      user: 'user',
      watson: 'watson'
    }
  };

    return {
    init: init,
    inputKeyDown: inputKeyDown
  };

  
  function init() {
    chatUpdateSetup();
    Api.sendRequest( '', null );
    setupInputBox();
  }
  
  function chatUpdateSetup() {
    var currentRequestPayloadSetter = Api.setRequestPayload;
    Api.setRequestPayload = function(newPayloadStr) {
      currentRequestPayloadSetter.call(Api, newPayloadStr);
      displayMessage(JSON.parse(newPayloadStr), settings.messageSource.user);
    };
    var currentResponsePayloadSetter = Api.setResponsePayload;
    Api.setResponsePayload = function(newPayloadStr) {
      currentResponsePayloadSetter.call(Api, newPayloadStr);
      displayMessage(JSON.parse(newPayloadStr), settings.messageSource.watson);
    };
  }

  function setupInputBox() {
    var input = document.getElementById('textInput');
    var dummy = document.getElementById('textInputDummy');
    var minFontSize = 14;
    var maxFontSize = 16;
    var minPadding = 4;
    var maxPadding = 6;
    input.addEventListener('input', adjustInput);
    window.addEventListener('resize', adjustInput);
    Common.fireEvent(input, 'input');
  }
  
  function displayMessage(newPayload, typeValue) {
    var isUser = isUserMessage(typeValue);
    var textExists = (newPayload.input && newPayload.input.text)
      || (newPayload.output && newPayload.output.text);
    if (isUser !== null && textExists) {
      var messageDivs = buildMessageDomElements(newPayload, isUser);
      var chatBoxElement = document.querySelector(settings.selectors.chatBox);
      var previousLatest = chatBoxElement.querySelectorAll((isUser
              ? settings.selectors.fromUser : settings.selectors.fromWatson)
              + settings.selectors.latest);
      if (previousLatest) {
        Common.listForEach(previousLatest, function(element) {
          element.classList.remove('latest');
        });
      }
      messageDivs.forEach(function(currentDiv) {
        chatBoxElement.appendChild(currentDiv);
        currentDiv.classList.add('load');
      });
      scrollToChatBottom();
    }
  }

  function isUserMessage(typeValue) {
    if (typeValue === settings.messageSource.user) {
      return true;
    } else if (typeValue === settings.messageSource.watson) {
      return false;
    }
    return null;
  }

  function buildMessageDomElements(newPayload, isUser) {
    var textArray = isUser ? newPayload.input.text : newPayload.output.text;
    if (Object.prototype.toString.call( textArray ) !== '[object Array]') {
      textArray = [textArray];
    }
    var messageArray = [];
    textArray.forEach(function(currentText) {
      if (currentText) {
        var messageJson = {
          'tagName': 'div',
          'children': [{
            'tagName': 'div',
            'classNames': [(isUser ? 'usertext' : 'from-watson'), 'latest', ((messageArray.length === 0) ? 'top' : 'sub')],
            'children': [{
              'tagName': 'div',
                'children': [{
                'tagName': 'p',
                'text': currentText
              }]
            }]
          }]
        };
        messageArray.push(Common.buildDomElement(messageJson));
      }
    });

    return messageArray;
  }

  function scrollToChatBottom() {
    var scrollingChat = document.querySelector('#scrollingChat'); 
    var scrollEl = scrollingChat.querySelector(settings.selectors.fromUser
            + settings.selectors.latest);
    if (scrollEl) {
      scrollingChat.scrollTop = scrollEl.offsetTop;
    }
  }

  function inputKeyDown(event, inputBox) {
     if (event.keyCode === 13 && inputBox.value) {
      var context;
      var latestResponse = Api.getResponsePayload();
      if (latestResponse) {
        context = latestResponse.context;
      }
       Api.sendRequest(inputBox.value, context);
      inputBox.value = '';
      Common.fireEvent(inputBox, 'input');
    }
  }
}());
