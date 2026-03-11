(function() {
  var evtSource = null;

  function connectSSE() {
    evtSource = new EventSource('/events');
    evtSource.onmessage = function(msg) {
      var data = JSON.parse(msg.data);
      if (data.type === 'reload') window.location.reload();
    };
    evtSource.onerror = function() {
      evtSource.close();
      setTimeout(connectSSE, 1000);
    };
  }

  function sendEvent(event) {
    event.timestamp = Date.now();
    fetch('/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    }).catch(function() {});
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
        var label = (selected[0].querySelector('h3, .content h3, .card-body h3') || {}).textContent || selected[0].dataset.choice;
        indicator.innerHTML = '<span class="selected-text">' + label.trim() + ' selected</span> \u2014 return to terminal to continue';
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

  connectSSE();
})();
