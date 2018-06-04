$(function () {
  var CODE = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    BACK: 8,
    ENTER: 13,
    SPACE: 32,

  };

  var userName = $("#username");
  var passWord = $("#password");
  var noLoginSection = $("#noLoginSection");
  var loginSection = $("#loginSection");
  var content = $("#content");
  var template = $("#template");
  var code = $("#code");
  var $codeContent = $("#code-content");
  var $fakeinput = $("#fakeinput");
  var $cursor = $('.code-cursor');
  var $loginBtn = $('#loginBtn');
  var codeContent = $codeContent.get(0);

  /*
  登录-start
   */
  $loginBtn.on('click', function (e) {
    $.post('/login', {
      name: userName.val(),
      password: passWord.val(),
    }, function (res) {
      if (res.code !== 0) {
        alert(res.message);
      }

      else {
        noLoginSection.hide();
        content.html('<p id="loginSection">欢迎，' + userName.val() + '</p>');
      }
    });
  });

  $('#code').on('keydown', function (e) {
    var keyCode = e.keyCode || e.which || e.charCode;
    var ctrlKey = e.ctrlKey || e.metaKey;
    if(ctrlKey && keyCode == 83) {
      e.preventDefault();
      $('#submit').trigger('click');
    }
  });

  $('#submit').on('click', function (e) {
    $.post('/save', {
      id: 'test',
      content: code.val(),
    }, function (res) {
      if (res.code !== 0) {
        alert(res.message);
      }

      else {
        var script = document.createElement('script');
        var body = template.get(0).contentDocument.body;
        var child;
        script.type = 'text/javascript';
        if (script.innerHTML !== res.data) {
          script.innerHTML = res.data;
          script.id = 'test';
          if (child || (child = body.querySelector('#test'))) {
            body.replaceChild(script, child);
            child = script;
          }

          else {
            body.appendChild(script);
          }
        }
      }
    });
  });
  /*
  登录-end
   */




  var editing = false;
  var editingBox = null;
  var currentEl = null;
  var IMEinput = false;
  var currentVal = '';
  var currentLine = $('.code-line');
  var lHEIGHT = 20;
  var lWIDTH = 8;

  function setCursorPosition (evt) {
    var x = evt.offsetX;
    var y = evt.offsetY;
    var target = evt.target;

    if (target === codeContent) {
      y = y - y % lHEIGHT;
    }

    else {
      x += target.offsetLeft;
      y += target.offsetTop;
      x = x - x % lWIDTH;
      y = y - y % lHEIGHT;
    }
    $cursor.css('left', x + 'px');
    $cursor.css('top', y + 'px');
  };

  function getLineStr (data) {
    return `
      <div class="code-line">
        <span class="code-part">${data}</span>
      </div>
    `;
  };

  function getPartStr (data) {
    return `
      <span class="code-part">${data}</span>
    `;
  };

  /*
  keypress function -start
   */
  
  function back (e) {
    e.preventDefault();
    if (currentEl) {
      var len = currentEl.textContent.length;
      if (!len) {
        if (!currentLine.get(0).textContent) {
          codeContent.removeChild(currentLine.get(0));  
        }

        else {
          currentLine.remove($(currentEl));
        }

        currentLine = $(codeContent.lastElementChild);
        currentEl = currentLine.lastElementChild;
      }

      else {
        currentEl.textContent = currentEl.textContent.substr(0, len - 1);
      }
    }
  };

  function space (e) {
    e.preventDefault();
    if (/^\s+$/.test(currentEl.textContent)) {
      currentEl.innerHTML += '&nbsp;';
    }

    else {
      currentEl = $(getPartStr('&nbsp;'));
      currentLine.append(currentEl);
      currentEl = currentEl.get(0);
    }
  };

  function enter (str) {
    var $codeLine = $(getLineStr(str));
    currentEl = $codeLine.get(0).querySelector('span');
    currentLine = $codeLine;
    $codeContent.append($codeLine);
  };

  function mUp (e) {
    e.preventDefault();
    var top = parseInt($cursor.css('top'));
    $cursor.css('top', top - lHEIGHT + 'px');
  };

  function mDown (e) {
    e.preventDefault();
    var top = parseInt($cursor.css('top'));
    $cursor.css('top', top + lHEIGHT + 'px');
  };

  function mLeft (e) {
    e.preventDefault();
    var left = parseInt($cursor.css('left'));
    $cursor.css('left', left - lWIDTH + 'px');
  };

  function mRight (e) {
    e.preventDefault();
    var left = parseInt($cursor.css('left'));
    $cursor.css('left', left + lWIDTH + 'px');
  };

  /*
  keypress function -end
   */

  $codeContent.on('click', function (e) {
    editing = true;
    setCursorPosition(e);
    $cursor.css('display', 'inline-block');
  })

  $(document.body).on('click', function (e) {
    var el = e.target;
    editing = codeContent.contains(el);
    $cursor.css('display', editing || el === codeContent ? 'inline-block' : 'none');
  }).on('keypress', function (e) {
    var keyCode = e.keyCode || e.which || e.charCode;
    var letter = String.fromCharCode(keyCode);

    if (editing && keyCode >= 34) {
      $fakeinput.trigger('focus');
      if (!currentEl) {
        enter(letter);
      }
      
      else if (currentEl !== codeContent) {
        currentEl = currentEl.classList.contains('code-line') ? currentEl.lastElementChild : currentEl;
        currentEl.textContent += letter;
      }

      else {
        enter(letter);
      }
    }
  }).on('keydown', function (e) {
    if (!editing) return;
    var keyCode = e.keyCode || e.which || e.charCode;
    
    switch (keyCode) {
      case CODE.BACK: back(e); break;
      case CODE.SPACE: space(e); break;
      case CODE.ENTER: enter(''); break;
      case CODE.UP: mUp(e); break;
      case CODE.DOWN: mDown(e); break;
      case CODE.LEFT: mLeft(e); break;
      case CODE.RIGHT: mRight(e); break;
      default: break;
    };
  });
  
  $fakeinput.on('keyup keydown keypress', function (e) {
    if (!IMEinput) e.target.value = '';
  }).on('keyup', function (e) {
    if (IMEinput) {
      currentEl.textContent = currentVal + e.target.value;
    }
  }).on('compositionstart', function (e) {
    e.target.value = '';
    IMEinput = true;
    currentVal = currentEl.textContent;
    console.log('compositionstart');
  }).on('compositionupdate', function (e) {
    var keyCode = e.keyCode || e.which || e.charCode;
  }).on('compositionend', function (e) {
    IMEinput = false;
    currentEl.textContent = currentVal + e.target.value;
  });
});