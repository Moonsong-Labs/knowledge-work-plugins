(function() {
  var WS_URL = 'ws://' + window.location.host;
  var ws = null;
  var eventQueue = [];

  function connect() {
    ws = new WebSocket(WS_URL);

    ws.onopen = function() {
      eventQueue.forEach(function(e) { ws.send(JSON.stringify(e)); });
      eventQueue = [];
    };

    ws.onmessage = function(msg) {
      var data = JSON.parse(msg.data);
      if (data.type === 'reload') window.location.reload();
    };

    ws.onclose = function() {
      setTimeout(connect, 1000);
    };
  }

  function sendEvent(event) {
    event.timestamp = Date.now();
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(event));
    } else {
      eventQueue.push(event);
    }
  }

  document.addEventListener('click', function(e) {
    var target = e.target.closest('[data-choice]');
    if (!target) return;

    sendEvent({
      type: 'click',
      text: target.textContent.trim(),
      choice: target.dataset.choice,
      id: target.id || null
    });

    setTimeout(function() {
      var indicator = document.getElementById('indicator-text');
      if (!indicator) return;
      var container = target.closest('.options') || target.closest('.cards');
      var selected = container ? container.querySelectorAll('.selected') : [];
      if (selected.length === 0) {
        indicator.textContent = 'Click an option above, then return to the terminal';
      } else if (selected.length === 1) {
        var el = selected[0];
        var h3 = el.querySelector('h3, .content h3, .card-body h3');
        var label = (h3 && h3.textContent ? h3.textContent.trim() : null) || el.dataset.choice;
        indicator.innerHTML = '<span class="selected-text">' + label + ' selected</span> \u2014 return to terminal to continue';
      } else {
        indicator.innerHTML = '<span class="selected-text">' + selected.length + ' selected</span> \u2014 return to terminal to continue';
      }
    }, 0);
  });

  window.selectedChoice = null;

  window.toggleSelect = function(el) {
    var container = el.closest('.options') || el.closest('.cards');
    var multi = container && container.dataset.multiselect !== undefined;
    if (container && !multi) {
      container.querySelectorAll('.option, .card').forEach(function(o) { o.classList.remove('selected'); });
    }
    if (multi) {
      el.classList.toggle('selected');
    } else {
      el.classList.add('selected');
    }
    window.selectedChoice = el.dataset.choice;
  };

  window.brainstorm = {
    send: sendEvent,
    choice: function(value, metadata) { sendEvent(Object.assign({ type: 'choice', value: value }, metadata || {})); }
  };

  connect();
})();
