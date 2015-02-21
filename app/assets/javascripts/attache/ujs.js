(function() {
  function attacheFileInputs() {
    var safeWords = { 'class': 'className', 'for': 'htmlFor' };
    var sel = document.getElementsByClassName('enable-attache');
    var ele, attrs, name, value;
    for (var i = sel.length-1; i >= 0; i--) {
      ele = sel[i];
      attrs = {};
      for (var j = 0; j < ele.attributes.length; j++) {
        name = ele.attributes[j].name;
        value = ele.attributes[j].value;
        if (name === 'class') value = value.replace('enable-attache', 'attache-enabled');
        name = safeWords[name] || name;
        attrs[name] = value;
      }
      var wrap = document.createElement('div');
      ele.parentNode.replaceChild(wrap, ele); // ele.parentNode.insertBefore(wrap, ele.nextSibling);
      React.render(React.createElement(AttacheFileInput, React.__spread({},  attrs)), wrap);
    }
  }

  $(document).on('page:change', attacheFileInputs);
})();
