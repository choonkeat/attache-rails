(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.attache = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _file_input = require('./attache/file_input');

var upgradeFileInput = function upgradeFileInput() {
  var safeWords = { 'class': 'className', 'for': 'htmlFor' };
  var sel = document.getElementsByClassName('enable-attache');
  var ele, attrs, name, value;
  for (var i = sel.length - 1; i >= 0; i--) {
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
    ele.parentNode.replaceChild(wrap, ele);
    ReactDOM.render(React.createElement(_file_input.AttacheFileInput, React.__spread({}, attrs)), wrap);
  }
}; /*global $*/
/*global React*/
/*global ReactDOM*/

$(document).on('page:change', upgradeFileInput);
$(upgradeFileInput);

},{"./attache/file_input":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*global $*/
/*global React*/

var Bootstrap3FilePreview = exports.Bootstrap3FilePreview = React.createClass({
  displayName: 'Bootstrap3FilePreview',
  getInitialState: function getInitialState() {
    return { srcWas: '' };
  },
  onSrcLoaded: function onSrcLoaded(event) {
    this.setState({ srcWas: this.props.src });
    $(event.target).trigger('attache:imgload');
  },
  onSrcError: function onSrcError(event) {
    $(event.target).trigger('attache:imgerror');
  },
  render: function render() {
    var previewClassName = 'attache-file-preview';

    // progressbar
    if (this.state.srcWas !== this.props.src) {
      previewClassName = previewClassName + ' attache-loading';
      var className = this.props.className || 'progress-bar progress-bar-striped active' + (this.props.src ? ' progress-bar-success' : '');
      var pctString = this.props.pctString || (this.props.src ? 100 : this.props.percentLoaded) + '%';
      var pctDesc = this.props.pctDesc || (this.props.src ? 'Loading...' : pctString);
      var pctStyle = { width: pctString, minWidth: '3em' };
      var progress = React.createElement(
        'div',
        { className: 'progress' },
        React.createElement(
          'div',
          {
            className: className,
            role: 'progressbar',
            'aria-valuenow': this.props.percentLoaded,
            'aria-valuemin': '0',
            'aria-valuemax': '100',
            style: pctStyle },
          pctDesc
        )
      );
    }

    // img tag
    if (this.props.src) {
      var img = React.createElement('img', { src: this.props.src, onLoad: this.onSrcLoaded, onError: this.onSrcError });
    }

    // combined
    return React.createElement(
      'div',
      { className: previewClassName },
      progress,
      img,
      React.createElement(
        'div',
        { className: 'clearfix' },
        React.createElement(
          'div',
          { className: 'pull-left' },
          this.props.filename
        ),
        React.createElement(
          'a',
          {
            href: '#remove',
            className: 'pull-right',
            onClick: this.props.onRemove,
            title: 'Click to remove' },
          '×'
        )
      )
    );
  }
});

var Bootstrap3Placeholder = exports.Bootstrap3Placeholder = React.createClass({
  displayName: 'Bootstrap3Placeholder',
  render: function render() {
    return React.createElement(
      'div',
      { className: 'attache-file-preview' },
      React.createElement('img', { src: this.props.src })
    );
  }
});

var Bootstrap3Header = exports.Bootstrap3Header = React.createClass({
  displayName: 'Bootstrap3Header',
  render: function render() {
    return React.createElement('noscript', null);
  }
});

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*global $*/
/*global alert*/
/*global XMLHttpRequest*/
/*global XDomainRequest*/

var counter = 0;

var CORSUpload = exports.CORSUpload = (function () {
  function CORSUpload(options) {
    _classCallCheck(this, CORSUpload);

    if (options == null) options = {};
    var option;
    for (option in options) {
      this[option] = options[option];
    }
  }

  // for overwriting

  _createClass(CORSUpload, [{
    key: 'createLocalThumbnail',
    value: function createLocalThumbnail() {}
  }, {
    key: 'onComplete',
    value: function onComplete(uid, json) {}
  }, {
    key: 'onProgress',
    value: function onProgress(uid, json) {}
  }, {
    key: 'onError',
    value: function onError(uid, status) {
      alert(status);
    }
  }, {
    key: 'handleFileSelect',
    value: function handleFileSelect() {
      var f, _i, _len, _results, url, $ele, prefix;
      $ele = $(this.file_element);
      url = $ele.data('uploadurl');
      if ($ele.data('hmac')) {
        url = url + '?hmac=' + encodeURIComponent($ele.data('hmac')) + '&uuid=' + encodeURIComponent($ele.data('uuid')) + '&expiration=' + encodeURIComponent($ele.data('expiration')) + '';
      }

      prefix = Date.now() + '_';
      _results = [];
      for (_i = 0, _len = this.files.length; _i < _len; _i++) {
        f = this.files[_i];
        this.createLocalThumbnail(f); // if any
        f.uid = prefix + counter++;
        this.onProgress(f.uid, { src: f.src, filename: f.name, percentLoaded: 0, bytesLoaded: 0, bytesTotal: f.size });
        _results.push(this.performUpload(f, url));
      }
      return _results;
    }
  }, {
    key: 'createCORSRequest',
    value: function createCORSRequest(method, url) {
      var xhr;
      xhr = new XMLHttpRequest();
      if (xhr.withCredentials != null) {
        xhr.open(method, url, true);
      } else if (typeof XDomainRequest !== 'undefined') {
        xhr = new XDomainRequest();
        xhr.open(method, url);
      } else {
        xhr = null;
      }
      return xhr;
    }
  }, {
    key: 'performUpload',
    value: function performUpload(file, url) {
      var this_s3upload, xhr;
      this_s3upload = this;
      url = url + (url.indexOf('?') === -1 ? '?' : '&') + 'file=' + encodeURIComponent(file.name);
      xhr = this.createCORSRequest('PUT', url);
      if (!xhr) {
        this.onError(file.uid, 'CORS not supported');
      } else {
        xhr.onload = function (e) {
          if (xhr.status === 200) {
            this_s3upload.onComplete(file.uid, JSON.parse(e.target.responseText));
          } else {
            return this_s3upload.onError(file.uid, xhr.status + ' ' + xhr.statusText);
          }
        };
        xhr.onerror = function () {
          return this_s3upload.onError(file.uid, 'Unable to reach server');
        };
        xhr.upload.onprogress = function (e) {
          var percentLoaded;
          if (e.lengthComputable) {
            percentLoaded = Math.round(e.loaded / e.total * 100);
            return this_s3upload.onProgress(file.uid, { src: file.src, filename: file.name, percentLoaded: percentLoaded, bytesLoaded: e.loaded, bytesTotal: e.total });
          }
        };
      }
      return xhr.send(file);
    }
  }]);

  return CORSUpload;
})();

},{}],4:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*global $*/
/*global window*/
/*global React*/
/*global ReactDOM*/

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AttacheFileInput = undefined;

var _cors_upload = require('./cors_upload');

var _bootstrap = require('./bootstrap3');

var AttacheFileInput = exports.AttacheFileInput = React.createClass({
  displayName: 'AttacheFileInput',
  getInitialState: function getInitialState() {
    var files = {};
    if (this.props['data-value']) {
      $.each(JSON.parse(this.props['data-value']), function (uid, json) {
        if (json) files[uid] = json;
      });
    }
    return { files: files, attaches_discarded: [], uploading: 0 };
  },
  onRemove: function onRemove(uid, e) {
    e.preventDefault();
    e.stopPropagation();

    var fieldname = ReactDOM.findDOMNode(this).firstChild.name; // when   'user[avatar]'
    var newfield = fieldname.replace(/\w+\](\[\]|)$/, 'attaches_discarded][]'); // become 'user[attaches_discarded][]'

    this.state.attaches_discarded.push({ fieldname: newfield, path: this.state.files[uid].path });
    delete this.state.files[uid];

    this.setState(this.state);
  },
  performUpload: function performUpload(file_element, files) {
    // user cancelled file chooser dialog. ignore
    if (!files || files.length === 0) return;
    if (!this.props.multiple) {
      this.state.files = {};
      files = [files[0]]; // array of 1 element
    }

    this.setState(this.state);
    // upload the file via CORS
    var that = this;

    that.state.uploading = that.state.uploading + files.length;
    if (!that.state.submit_buttons) that.state.submit_buttons = $("button,input[type='submit']", $(file_element).parents('form')[0]).filter(':not(:disabled)');

    var upload = new _cors_upload.CORSUpload({
      file_element: file_element,
      files: files,
      onProgress: this.setFileValue,
      onComplete: function onComplete() {
        that.state.uploading--;
        that.setFileValue.apply(this, arguments);
      },
      onError: function onError(uid, status) {
        that.state.uploading--;
        that.setFileValue(uid, { pctString: '90%', pctDesc: status, className: 'progress-bar progress-bar-danger' });
      }
    });
    upload.handleFileSelect();

    // we don't want the file binary to be uploaded in the main form
    // so the actual file input is neutered
    file_element.value = '';
  },
  onChange: function onChange() {
    var file_element = ReactDOM.findDOMNode(this).firstChild;
    this.performUpload(file_element, file_element && file_element.files);
  },
  onDragOver: function onDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    $(ReactDOM.findDOMNode(this)).addClass('attache-dragover');
  },
  onDragLeave: function onDragLeave(e) {
    e.stopPropagation();
    e.preventDefault();
    $(ReactDOM.findDOMNode(this)).removeClass('attache-dragover');
  },
  onDrop: function onDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    var file_element = ReactDOM.findDOMNode(this).firstChild;
    this.performUpload(file_element, e.target.files || e.dataTransfer.files);
    $(ReactDOM.findDOMNode(this)).removeClass('attache-dragover');
  },
  setFileValue: function setFileValue(key, value) {
    this.state.files[key] = value;
    this.setState(this.state);
  },
  render: function render() {
    var that = this;
    var Header = window.AttacheHeader || _bootstrap.Bootstrap3Header;
    var FilePreview = window.AttacheFilePreview || _bootstrap.Bootstrap3FilePreview;
    var Placeholder = window.AttachePlaceholder || _bootstrap.Bootstrap3Placeholder;

    if (that.state.uploading > 0) {
      that.state.submit_buttons.attr('disabled', true);
    } else if (that.state.submit_buttons) {
      that.state.submit_buttons.attr('disabled', null);
    }

    var previews = [];
    $.each(that.state.files, function (key, result) {
      // json is input[value], drop non essential values
      var copy = JSON.parse(JSON.stringify(result));
      delete copy.src;
      delete copy.filename;
      var json = JSON.stringify(copy);
      //
      result.multiple = that.props.multiple;
      if (result.path) {
        var parts = result.path.split('/');
        result.filename = parts.pop().split(/[#?]/).shift();
        parts.push(encodeURIComponent(that.props['data-geometry'] || '128x128#'));
        parts.push(encodeURIComponent(result.filename));
        result.src = that.props['data-downloadurl'] + '/' + parts.join('/');
      }
      var previewKey = 'preview' + key;
      previews.push(React.createElement(
        'div',
        { key: previewKey, className: 'attache-file-input' },
        React.createElement('input', {
          type: 'hidden',
          name: that.props.name,
          value: json,
          readOnly: 'true' }),
        React.createElement(FilePreview, _extends({}, result, { key: key, onRemove: that.onRemove.bind(that, key) }))
      ));
    });

    var placeholders = [];
    if (previews.length === 0 && that.props['data-placeholder']) {
      $.each(JSON.parse(that.props['data-placeholder']), function (uid, src) {
        placeholders.push(React.createElement(Placeholder, _extends({ key: 'placeholder' }, that.props, { src: src })));
      });
    }

    var discards = [];
    $.each(that.state.attaches_discarded, function (index, discard) {
      var discardKey = 'discard' + discard.path;
      discards.push(React.createElement('input', {
        key: discardKey,
        type: 'hidden',
        name: discard.fieldname,
        value: discard.path }));
    });

    var className = ['attache-file-selector', 'attache-placeholders-count-' + placeholders.length, 'attache-previews-count-' + previews.length, this.props['data-classname']].join(' ').trim();
    return React.createElement(
      'label',
      {
        htmlFor: that.props.id,
        className: className,
        onDragOver: this.onDragOver,
        onDragLeave: this.onDragLeave,
        onDrop: this.onDrop },
      React.createElement('input', _extends({ type: 'file' }, that.props, { onChange: this.onChange })),
      React.createElement('input', { type: 'hidden', name: that.props.name, value: '' }),
      React.createElement(Header, that.props),
      previews,
      placeholders,
      discards
    );
  }
});

},{"./bootstrap3":2,"./cors_upload":3}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjQuMS4wL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL2phdmFzY3JpcHRzL2F0dGFjaGUuanMiLCJzcmMvamF2YXNjcmlwdHMvYXR0YWNoZS9ib290c3RyYXAzLmpzIiwic3JjL2phdmFzY3JpcHRzL2F0dGFjaGUvY29yc191cGxvYWQuanMiLCJzcmMvamF2YXNjcmlwdHMvYXR0YWNoZS9maWxlX2lucHV0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ01BLElBQUksZ0JBQWdCLEdBQUcsU0FBbkIsZ0JBQWdCLEdBQWU7QUFDakMsTUFBSSxTQUFTLEdBQUcsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQTtBQUMxRCxNQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsc0JBQXNCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtBQUMzRCxNQUFJLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQTtBQUMzQixPQUFLLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDeEMsT0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNaLFNBQUssR0FBRyxFQUFFLENBQUE7QUFDVixTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDOUMsVUFBSSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO0FBQzdCLFdBQUssR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQTtBQUMvQixVQUFJLElBQUks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Q0FBQyxXQUFXLEFBQUM7QUFDOUIsY0FBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEFBQUM7TUFDcEIsd0NBQU8sSUFBSSxFQUFDLE1BQU0sSUFBSyxJQUFJLENBQUMsS0FBSyxJQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxBQUFDLElBQUc7TUFDOUQsK0JBQU8sSUFBSSxFQUFDLFFBQVEsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEFBQUMsRUFBQyxLQUFLLEVBQUMsRUFBRSxHQUFHO01BQ3ZELG9CQUFDLE1BQU0sRUFBSyxJQUFJLENBQUMsS0FBSyxDQUFJO01BQ3pCLFFBQVE7TUFDUixZQUFZO01BQ1osUUFBUTtLQUNILENBQ1A7R0FDRjtDQUNGLENBQUMsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKmdsb2JhbCAkKi9cbi8qZ2xvYmFsIFJlYWN0Ki9cbi8qZ2xvYmFsIFJlYWN0RE9NKi9cblxuaW1wb3J0IHsgQXR0YWNoZUZpbGVJbnB1dCB9IGZyb20gJy4vYXR0YWNoZS9maWxlX2lucHV0J1xuXG52YXIgdXBncmFkZUZpbGVJbnB1dCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNhZmVXb3JkcyA9IHsgJ2NsYXNzJzogJ2NsYXNzTmFtZScsICdmb3InOiAnaHRtbEZvcicgfVxuICB2YXIgc2VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZW5hYmxlLWF0dGFjaGUnKVxuICB2YXIgZWxlLCBhdHRycywgbmFtZSwgdmFsdWVcbiAgZm9yICh2YXIgaSA9IHNlbC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGVsZSA9IHNlbFtpXVxuICAgIGF0dHJzID0ge31cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGVsZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICBuYW1lID0gZWxlLmF0dHJpYnV0ZXNbal0ubmFtZVxuICAgICAgdmFsdWUgPSBlbGUuYXR0cmlidXRlc1tqXS52YWx1ZVxuICAgICAgaWYgKG5hbWUgPT09ICdjbGFzcycpIHZhbHVlID0gdmFsdWUucmVwbGFjZSgnZW5hYmxlLWF0dGFjaGUnLCAnYXR0YWNoZS1lbmFibGVkJylcbiAgICAgIG5hbWUgPSBzYWZlV29yZHNbbmFtZV0gfHwgbmFtZVxuICAgICAgYXR0cnNbbmFtZV0gPSB2YWx1ZVxuICAgIH1cbiAgICB2YXIgd3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgZWxlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHdyYXAsIGVsZSlcbiAgICBSZWFjdERPTS5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChBdHRhY2hlRmlsZUlucHV0LCBSZWFjdC5fX3NwcmVhZCh7fSwgYXR0cnMpKSwgd3JhcClcbiAgfVxufVxuXG4kKGRvY3VtZW50KS5vbigncGFnZTpjaGFuZ2UnLCB1cGdyYWRlRmlsZUlucHV0KVxuJCh1cGdyYWRlRmlsZUlucHV0KVxuIiwiLypnbG9iYWwgJCovXG4vKmdsb2JhbCBSZWFjdCovXG5cbmV4cG9ydCB2YXIgQm9vdHN0cmFwM0ZpbGVQcmV2aWV3ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGUgKCkge1xuICAgIHJldHVybiB7IHNyY1dhczogJycgfVxuICB9LFxuXG4gIG9uU3JjTG9hZGVkIChldmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzcmNXYXM6IHRoaXMucHJvcHMuc3JjIH0pXG4gICAgJChldmVudC50YXJnZXQpLnRyaWdnZXIoJ2F0dGFjaGU6aW1nbG9hZCcpXG4gIH0sXG5cbiAgb25TcmNFcnJvciAoZXZlbnQpIHtcbiAgICAkKGV2ZW50LnRhcmdldCkudHJpZ2dlcignYXR0YWNoZTppbWdlcnJvcicpXG4gIH0sXG5cbiAgcmVuZGVyICgpIHtcbiAgICB2YXIgcHJldmlld0NsYXNzTmFtZSA9ICdhdHRhY2hlLWZpbGUtcHJldmlldydcblxuICAgIC8vIHByb2dyZXNzYmFyXG4gICAgaWYgKHRoaXMuc3RhdGUuc3JjV2FzICE9PSB0aGlzLnByb3BzLnNyYykge1xuICAgICAgcHJldmlld0NsYXNzTmFtZSA9IHByZXZpZXdDbGFzc05hbWUgKyAnIGF0dGFjaGUtbG9hZGluZydcbiAgICAgIHZhciBjbGFzc05hbWUgPSB0aGlzLnByb3BzLmNsYXNzTmFtZSB8fCAncHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci1zdHJpcGVkIGFjdGl2ZScgKyAodGhpcy5wcm9wcy5zcmMgPyAnIHByb2dyZXNzLWJhci1zdWNjZXNzJyA6ICcnKVxuICAgICAgdmFyIHBjdFN0cmluZyA9IHRoaXMucHJvcHMucGN0U3RyaW5nIHx8ICh0aGlzLnByb3BzLnNyYyA/IDEwMCA6IHRoaXMucHJvcHMucGVyY2VudExvYWRlZCkgKyAnJSdcbiAgICAgIHZhciBwY3REZXNjID0gdGhpcy5wcm9wcy5wY3REZXNjIHx8ICh0aGlzLnByb3BzLnNyYyA/ICdMb2FkaW5nLi4uJyA6IHBjdFN0cmluZylcbiAgICAgIHZhciBwY3RTdHlsZSA9IHsgd2lkdGg6IHBjdFN0cmluZywgbWluV2lkdGg6ICczZW0nIH1cbiAgICAgIHZhciBwcm9ncmVzcyA9IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZ3Jlc3NcIj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuICAgICAgICAgIHJvbGU9XCJwcm9ncmVzc2JhclwiXG4gICAgICAgICAgYXJpYS12YWx1ZW5vdz17dGhpcy5wcm9wcy5wZXJjZW50TG9hZGVkfVxuICAgICAgICAgIGFyaWEtdmFsdWVtaW49XCIwXCJcbiAgICAgICAgICBhcmlhLXZhbHVlbWF4PVwiMTAwXCJcbiAgICAgICAgICBzdHlsZT17cGN0U3R5bGV9PlxuICAgICAgICAgIHtwY3REZXNjfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIC8vIGltZyB0YWdcbiAgICBpZiAodGhpcy5wcm9wcy5zcmMpIHtcbiAgICAgIHZhciBpbWcgPSA8aW1nIHNyYz17dGhpcy5wcm9wcy5zcmN9IG9uTG9hZD17dGhpcy5vblNyY0xvYWRlZH0gb25FcnJvcj17dGhpcy5vblNyY0Vycm9yfSAvPlxuICAgIH1cblxuICAgIC8vIGNvbWJpbmVkXG4gICAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17cHJldmlld0NsYXNzTmFtZX0+XG4gICAgICB7cHJvZ3Jlc3N9XG4gICAgICB7aW1nfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhcmZpeFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1bGwtbGVmdFwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmZpbGVuYW1lfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGFcbiAgICAgICAgICBocmVmPVwiI3JlbW92ZVwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwicHVsbC1yaWdodFwiXG4gICAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5vblJlbW92ZX1cbiAgICAgICAgICB0aXRsZT1cIkNsaWNrIHRvIHJlbW92ZVwiPiZ0aW1lczs8L2E+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn0pXG5cbmV4cG9ydCB2YXIgQm9vdHN0cmFwM1BsYWNlaG9sZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJhdHRhY2hlLWZpbGUtcHJldmlld1wiPlxuICAgICAgPGltZyBzcmM9e3RoaXMucHJvcHMuc3JjfSAvPlxuICAgIDwvZGl2PlxuICAgIClcbiAgfVxufSlcblxuZXhwb3J0IHZhciBCb290c3RyYXAzSGVhZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgPG5vc2NyaXB0IC8+XG4gICAgKVxuICB9XG59KVxuIiwiLypnbG9iYWwgJCovXG4vKmdsb2JhbCBhbGVydCovXG4vKmdsb2JhbCBYTUxIdHRwUmVxdWVzdCovXG4vKmdsb2JhbCBYRG9tYWluUmVxdWVzdCovXG5cbnZhciBjb3VudGVyID0gMFxuXG5leHBvcnQgY2xhc3MgQ09SU1VwbG9hZCB7XG4gIGNvbnN0cnVjdG9yIChvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkgb3B0aW9ucyA9IHt9XG4gICAgdmFyIG9wdGlvblxuICAgIGZvciAob3B0aW9uIGluIG9wdGlvbnMpIHtcbiAgICAgIHRoaXNbb3B0aW9uXSA9IG9wdGlvbnNbb3B0aW9uXVxuICAgIH1cbiAgfVxuXG4gIC8vIGZvciBvdmVyd3JpdGluZ1xuICBjcmVhdGVMb2NhbFRodW1ibmFpbCAoKSB7IH1cbiAgb25Db21wbGV0ZSAodWlkLCBqc29uKSB7IH1cbiAgb25Qcm9ncmVzcyAodWlkLCBqc29uKSB7IH1cbiAgb25FcnJvciAodWlkLCBzdGF0dXMpIHsgYWxlcnQoc3RhdHVzKSB9XG5cbiAgaGFuZGxlRmlsZVNlbGVjdCAoKSB7XG4gICAgdmFyIGYsIF9pLCBfbGVuLCBfcmVzdWx0cywgdXJsLCAkZWxlLCBwcmVmaXhcbiAgICAkZWxlID0gJCh0aGlzLmZpbGVfZWxlbWVudClcbiAgICB1cmwgPSAkZWxlLmRhdGEoJ3VwbG9hZHVybCcpXG4gICAgaWYgKCRlbGUuZGF0YSgnaG1hYycpKSB7XG4gICAgICB1cmwgPSB1cmwgK1xuICAgICAgICAnP2htYWM9JyArIGVuY29kZVVSSUNvbXBvbmVudCgkZWxlLmRhdGEoJ2htYWMnKSkgK1xuICAgICAgICAnJnV1aWQ9JyArIGVuY29kZVVSSUNvbXBvbmVudCgkZWxlLmRhdGEoJ3V1aWQnKSkgK1xuICAgICAgICAnJmV4cGlyYXRpb249JyArIGVuY29kZVVSSUNvbXBvbmVudCgkZWxlLmRhdGEoJ2V4cGlyYXRpb24nKSkgK1xuICAgICAgICAnJ1xuICAgIH1cblxuICAgIHByZWZpeCA9IERhdGUubm93KCkgKyAnXydcbiAgICBfcmVzdWx0cyA9IFtdXG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSB0aGlzLmZpbGVzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICBmID0gdGhpcy5maWxlc1tfaV1cbiAgICAgIHRoaXMuY3JlYXRlTG9jYWxUaHVtYm5haWwoZikgLy8gaWYgYW55XG4gICAgICBmLnVpZCA9IHByZWZpeCArIChjb3VudGVyKyspXG4gICAgICB0aGlzLm9uUHJvZ3Jlc3MoZi51aWQsIHsgc3JjOiBmLnNyYywgZmlsZW5hbWU6IGYubmFtZSwgcGVyY2VudExvYWRlZDogMCwgYnl0ZXNMb2FkZWQ6IDAsIGJ5dGVzVG90YWw6IGYuc2l6ZSB9KVxuICAgICAgX3Jlc3VsdHMucHVzaCh0aGlzLnBlcmZvcm1VcGxvYWQoZiwgdXJsKSlcbiAgICB9XG4gICAgcmV0dXJuIF9yZXN1bHRzXG4gIH1cblxuICBjcmVhdGVDT1JTUmVxdWVzdCAobWV0aG9kLCB1cmwpIHtcbiAgICB2YXIgeGhyXG4gICAgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICBpZiAoeGhyLndpdGhDcmVkZW50aWFscyAhPSBudWxsKSB7XG4gICAgICB4aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSlcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBYRG9tYWluUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHhociA9IG5ldyBYRG9tYWluUmVxdWVzdCgpXG4gICAgICB4aHIub3BlbihtZXRob2QsIHVybClcbiAgICB9IGVsc2Uge1xuICAgICAgeGhyID0gbnVsbFxuICAgIH1cbiAgICByZXR1cm4geGhyXG4gIH1cblxuICBwZXJmb3JtVXBsb2FkIChmaWxlLCB1cmwpIHtcbiAgICB2YXIgdGhpc19zM3VwbG9hZCwgeGhyXG4gICAgdGhpc19zM3VwbG9hZCA9IHRoaXNcbiAgICB1cmwgPSB1cmwgKyAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgJ2ZpbGU9JyArIGVuY29kZVVSSUNvbXBvbmVudChmaWxlLm5hbWUpXG4gICAgeGhyID0gdGhpcy5jcmVhdGVDT1JTUmVxdWVzdCgnUFVUJywgdXJsKVxuICAgIGlmICgheGhyKSB7XG4gICAgICB0aGlzLm9uRXJyb3IoZmlsZS51aWQsICdDT1JTIG5vdCBzdXBwb3J0ZWQnKVxuICAgIH0gZWxzZSB7XG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIHRoaXNfczN1cGxvYWQub25Db21wbGV0ZShmaWxlLnVpZCwgSlNPTi5wYXJzZShlLnRhcmdldC5yZXNwb25zZVRleHQpKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzX3MzdXBsb2FkLm9uRXJyb3IoZmlsZS51aWQsIHhoci5zdGF0dXMgKyAnICcgKyB4aHIuc3RhdHVzVGV4dClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzX3MzdXBsb2FkLm9uRXJyb3IoZmlsZS51aWQsICdVbmFibGUgdG8gcmVhY2ggc2VydmVyJylcbiAgICAgIH1cbiAgICAgIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBwZXJjZW50TG9hZGVkXG4gICAgICAgIGlmIChlLmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgICBwZXJjZW50TG9hZGVkID0gTWF0aC5yb3VuZCgoZS5sb2FkZWQgLyBlLnRvdGFsKSAqIDEwMClcbiAgICAgICAgICByZXR1cm4gdGhpc19zM3VwbG9hZC5vblByb2dyZXNzKGZpbGUudWlkLCB7IHNyYzogZmlsZS5zcmMsIGZpbGVuYW1lOiBmaWxlLm5hbWUsIHBlcmNlbnRMb2FkZWQ6IHBlcmNlbnRMb2FkZWQsIGJ5dGVzTG9hZGVkOiBlLmxvYWRlZCwgYnl0ZXNUb3RhbDogZS50b3RhbCB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB4aHIuc2VuZChmaWxlKVxuICB9XG59XG4iLCIvKmdsb2JhbCAkKi9cbi8qZ2xvYmFsIHdpbmRvdyovXG4vKmdsb2JhbCBSZWFjdCovXG4vKmdsb2JhbCBSZWFjdERPTSovXG5cbmltcG9ydCB7IENPUlNVcGxvYWQgfSBmcm9tICcuL2NvcnNfdXBsb2FkJ1xuaW1wb3J0IHsgQm9vdHN0cmFwM0hlYWRlciwgQm9vdHN0cmFwM0ZpbGVQcmV2aWV3LCBCb290c3RyYXAzUGxhY2Vob2xkZXIgfSBmcm9tICcuL2Jvb3RzdHJhcDMnXG5cbmV4cG9ydCB2YXIgQXR0YWNoZUZpbGVJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlICgpIHtcbiAgICB2YXIgZmlsZXMgPSB7fVxuICAgIGlmICh0aGlzLnByb3BzWydkYXRhLXZhbHVlJ10pIHtcbiAgICAgICQuZWFjaChKU09OLnBhcnNlKHRoaXMucHJvcHNbJ2RhdGEtdmFsdWUnXSksIGZ1bmN0aW9uICh1aWQsIGpzb24pIHtcbiAgICAgICAgaWYgKGpzb24pIGZpbGVzW3VpZF0gPSBqc29uXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4geyBmaWxlczogZmlsZXMsIGF0dGFjaGVzX2Rpc2NhcmRlZDogW10sIHVwbG9hZGluZzogMCB9XG4gIH0sXG5cbiAgb25SZW1vdmUgKHVpZCwgZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgIHZhciBmaWVsZG5hbWUgPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKS5maXJzdENoaWxkLm5hbWUgLy8gd2hlbiAgICd1c2VyW2F2YXRhcl0nXG4gICAgdmFyIG5ld2ZpZWxkID0gZmllbGRuYW1lLnJlcGxhY2UoL1xcdytcXF0oXFxbXFxdfCkkLywgJ2F0dGFjaGVzX2Rpc2NhcmRlZF1bXScpIC8vIGJlY29tZSAndXNlclthdHRhY2hlc19kaXNjYXJkZWRdW10nXG5cbiAgICB0aGlzLnN0YXRlLmF0dGFjaGVzX2Rpc2NhcmRlZC5wdXNoKHsgZmllbGRuYW1lOiBuZXdmaWVsZCwgcGF0aDogdGhpcy5zdGF0ZS5maWxlc1t1aWRdLnBhdGggfSlcbiAgICBkZWxldGUgdGhpcy5zdGF0ZS5maWxlc1t1aWRdXG5cbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUpXG4gIH0sXG5cbiAgcGVyZm9ybVVwbG9hZCAoZmlsZV9lbGVtZW50LCBmaWxlcykge1xuICAgIC8vIHVzZXIgY2FuY2VsbGVkIGZpbGUgY2hvb3NlciBkaWFsb2cuIGlnbm9yZVxuICAgIGlmICghZmlsZXMgfHwgZmlsZXMubGVuZ3RoID09PSAwKSByZXR1cm5cbiAgICBpZiAoIXRoaXMucHJvcHMubXVsdGlwbGUpIHtcbiAgICAgIHRoaXMuc3RhdGUuZmlsZXMgPSB7fVxuICAgICAgZmlsZXMgPSBbZmlsZXNbMF1dIC8vIGFycmF5IG9mIDEgZWxlbWVudFxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZSlcbiAgICAvLyB1cGxvYWQgdGhlIGZpbGUgdmlhIENPUlNcbiAgICB2YXIgdGhhdCA9IHRoaXNcblxuICAgIHRoYXQuc3RhdGUudXBsb2FkaW5nID0gdGhhdC5zdGF0ZS51cGxvYWRpbmcgKyBmaWxlcy5sZW5ndGhcbiAgICBpZiAoIXRoYXQuc3RhdGUuc3VibWl0X2J1dHRvbnMpIHRoYXQuc3RhdGUuc3VibWl0X2J1dHRvbnMgPSAkKFwiYnV0dG9uLGlucHV0W3R5cGU9J3N1Ym1pdCddXCIsICQoZmlsZV9lbGVtZW50KS5wYXJlbnRzKCdmb3JtJylbMF0pLmZpbHRlcignOm5vdCg6ZGlzYWJsZWQpJylcblxuICAgIHZhciB1cGxvYWQgPSBuZXcgQ09SU1VwbG9hZCh7XG4gICAgICBmaWxlX2VsZW1lbnQ6IGZpbGVfZWxlbWVudCxcbiAgICAgIGZpbGVzOiBmaWxlcyxcbiAgICAgIG9uUHJvZ3Jlc3M6IHRoaXMuc2V0RmlsZVZhbHVlLFxuICAgICAgb25Db21wbGV0ZSAoKSB7XG4gICAgICAgIHRoYXQuc3RhdGUudXBsb2FkaW5nLS1cbiAgICAgICAgdGhhdC5zZXRGaWxlVmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgfSxcbiAgICAgIG9uRXJyb3IgKHVpZCwgc3RhdHVzKSB7XG4gICAgICAgIHRoYXQuc3RhdGUudXBsb2FkaW5nLS1cbiAgICAgICAgdGhhdC5zZXRGaWxlVmFsdWUodWlkLCB7IHBjdFN0cmluZzogJzkwJScsIHBjdERlc2M6IHN0YXR1cywgY2xhc3NOYW1lOiAncHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci1kYW5nZXInIH0pXG4gICAgICB9XG4gICAgfSlcbiAgICB1cGxvYWQuaGFuZGxlRmlsZVNlbGVjdCgpXG5cbiAgICAvLyB3ZSBkb24ndCB3YW50IHRoZSBmaWxlIGJpbmFyeSB0byBiZSB1cGxvYWRlZCBpbiB0aGUgbWFpbiBmb3JtXG4gICAgLy8gc28gdGhlIGFjdHVhbCBmaWxlIGlucHV0IGlzIG5ldXRlcmVkXG4gICAgZmlsZV9lbGVtZW50LnZhbHVlID0gJydcbiAgfSxcblxuICBvbkNoYW5nZSAoKSB7XG4gICAgdmFyIGZpbGVfZWxlbWVudCA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpLmZpcnN0Q2hpbGRcbiAgICB0aGlzLnBlcmZvcm1VcGxvYWQoZmlsZV9lbGVtZW50LCBmaWxlX2VsZW1lbnQgJiYgZmlsZV9lbGVtZW50LmZpbGVzKVxuICB9LFxuXG4gIG9uRHJhZ092ZXIgKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgJChSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSkuYWRkQ2xhc3MoJ2F0dGFjaGUtZHJhZ292ZXInKVxuICB9LFxuXG4gIG9uRHJhZ0xlYXZlIChlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICQoUmVhY3RET00uZmluZERPTU5vZGUodGhpcykpLnJlbW92ZUNsYXNzKCdhdHRhY2hlLWRyYWdvdmVyJylcbiAgfSxcblxuICBvbkRyb3AgKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgdmFyIGZpbGVfZWxlbWVudCA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpLmZpcnN0Q2hpbGRcbiAgICB0aGlzLnBlcmZvcm1VcGxvYWQoZmlsZV9lbGVtZW50LCBlLnRhcmdldC5maWxlcyB8fCBlLmRhdGFUcmFuc2Zlci5maWxlcylcbiAgICAkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpKS5yZW1vdmVDbGFzcygnYXR0YWNoZS1kcmFnb3ZlcicpXG4gIH0sXG5cbiAgc2V0RmlsZVZhbHVlIChrZXksIHZhbHVlKSB7XG4gICAgdGhpcy5zdGF0ZS5maWxlc1trZXldID0gdmFsdWVcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUpXG4gIH0sXG5cbiAgcmVuZGVyICgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICB2YXIgSGVhZGVyID0gd2luZG93LkF0dGFjaGVIZWFkZXIgfHwgQm9vdHN0cmFwM0hlYWRlclxuICAgIHZhciBGaWxlUHJldmlldyA9IHdpbmRvdy5BdHRhY2hlRmlsZVByZXZpZXcgfHwgQm9vdHN0cmFwM0ZpbGVQcmV2aWV3XG4gICAgdmFyIFBsYWNlaG9sZGVyID0gd2luZG93LkF0dGFjaGVQbGFjZWhvbGRlciB8fCBCb290c3RyYXAzUGxhY2Vob2xkZXJcblxuICAgIGlmICh0aGF0LnN0YXRlLnVwbG9hZGluZyA+IDApIHtcbiAgICAgIHRoYXQuc3RhdGUuc3VibWl0X2J1dHRvbnMuYXR0cignZGlzYWJsZWQnLCB0cnVlKVxuICAgIH0gZWxzZSBpZiAodGhhdC5zdGF0ZS5zdWJtaXRfYnV0dG9ucykge1xuICAgICAgdGhhdC5zdGF0ZS5zdWJtaXRfYnV0dG9ucy5hdHRyKCdkaXNhYmxlZCcsIG51bGwpXG4gICAgfVxuXG4gICAgdmFyIHByZXZpZXdzID0gW11cbiAgICAkLmVhY2godGhhdC5zdGF0ZS5maWxlcywgZnVuY3Rpb24gKGtleSwgcmVzdWx0KSB7XG4gICAgICAvLyBqc29uIGlzIGlucHV0W3ZhbHVlXSwgZHJvcCBub24gZXNzZW50aWFsIHZhbHVlc1xuICAgICAgdmFyIGNvcHkgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpXG4gICAgICBkZWxldGUgY29weS5zcmNcbiAgICAgIGRlbGV0ZSBjb3B5LmZpbGVuYW1lXG4gICAgICB2YXIganNvbiA9IEpTT04uc3RyaW5naWZ5KGNvcHkpXG4gICAgICAvL1xuICAgICAgcmVzdWx0Lm11bHRpcGxlID0gdGhhdC5wcm9wcy5tdWx0aXBsZVxuICAgICAgaWYgKHJlc3VsdC5wYXRoKSB7XG4gICAgICAgIHZhciBwYXJ0cyA9IHJlc3VsdC5wYXRoLnNwbGl0KCcvJylcbiAgICAgICAgcmVzdWx0LmZpbGVuYW1lID0gcGFydHMucG9wKCkuc3BsaXQoL1sjP10vKS5zaGlmdCgpXG4gICAgICAgIHBhcnRzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KHRoYXQucHJvcHNbJ2RhdGEtZ2VvbWV0cnknXSB8fCAnMTI4eDEyOCMnKSlcbiAgICAgICAgcGFydHMucHVzaChlbmNvZGVVUklDb21wb25lbnQocmVzdWx0LmZpbGVuYW1lKSlcbiAgICAgICAgcmVzdWx0LnNyYyA9IHRoYXQucHJvcHNbJ2RhdGEtZG93bmxvYWR1cmwnXSArICcvJyArIHBhcnRzLmpvaW4oJy8nKVxuICAgICAgfVxuICAgICAgdmFyIHByZXZpZXdLZXkgPSAncHJldmlldycgKyBrZXlcbiAgICAgIHByZXZpZXdzLnB1c2goXG4gICAgICAgIDxkaXYga2V5PXtwcmV2aWV3S2V5fSBjbGFzc05hbWU9XCJhdHRhY2hlLWZpbGUtaW5wdXRcIj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJoaWRkZW5cIlxuICAgICAgICAgICAgbmFtZT17dGhhdC5wcm9wcy5uYW1lfVxuICAgICAgICAgICAgdmFsdWU9e2pzb259XG4gICAgICAgICAgICByZWFkT25seT1cInRydWVcIiAvPlxuICAgICAgICAgIDxGaWxlUHJldmlldyB7Li4ucmVzdWx0fSBrZXk9e2tleX0gb25SZW1vdmU9e3RoYXQub25SZW1vdmUuYmluZCh0aGF0LCBrZXkpfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9KVxuXG4gICAgdmFyIHBsYWNlaG9sZGVycyA9IFtdXG4gICAgaWYgKHByZXZpZXdzLmxlbmd0aCA9PT0gMCAmJiB0aGF0LnByb3BzWydkYXRhLXBsYWNlaG9sZGVyJ10pIHtcbiAgICAgICQuZWFjaChKU09OLnBhcnNlKHRoYXQucHJvcHNbJ2RhdGEtcGxhY2Vob2xkZXInXSksIGZ1bmN0aW9uICh1aWQsIHNyYykge1xuICAgICAgICBwbGFjZWhvbGRlcnMucHVzaChcbiAgICAgICAgICA8UGxhY2Vob2xkZXIga2V5PVwicGxhY2Vob2xkZXJcIiB7Li4udGhhdC5wcm9wc30gc3JjPXtzcmN9IC8+XG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdmFyIGRpc2NhcmRzID0gW11cbiAgICAkLmVhY2godGhhdC5zdGF0ZS5hdHRhY2hlc19kaXNjYXJkZWQsIGZ1bmN0aW9uIChpbmRleCwgZGlzY2FyZCkge1xuICAgICAgdmFyIGRpc2NhcmRLZXkgPSAnZGlzY2FyZCcgKyBkaXNjYXJkLnBhdGhcbiAgICAgIGRpc2NhcmRzLnB1c2goXG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIGtleT17ZGlzY2FyZEtleX1cbiAgICAgICAgICB0eXBlPVwiaGlkZGVuXCJcbiAgICAgICAgICBuYW1lPXtkaXNjYXJkLmZpZWxkbmFtZX1cbiAgICAgICAgICB2YWx1ZT17ZGlzY2FyZC5wYXRofSAvPlxuICAgICAgKVxuICAgIH0pXG5cbiAgICB2YXIgY2xhc3NOYW1lID0gWydhdHRhY2hlLWZpbGUtc2VsZWN0b3InLCAnYXR0YWNoZS1wbGFjZWhvbGRlcnMtY291bnQtJyArIHBsYWNlaG9sZGVycy5sZW5ndGgsICdhdHRhY2hlLXByZXZpZXdzLWNvdW50LScgKyBwcmV2aWV3cy5sZW5ndGgsIHRoaXMucHJvcHNbJ2RhdGEtY2xhc3NuYW1lJ11dLmpvaW4oJyAnKS50cmltKClcbiAgICByZXR1cm4gKFxuICAgIDxsYWJlbFxuICAgICAgaHRtbEZvcj17dGhhdC5wcm9wcy5pZH1cbiAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuICAgICAgb25EcmFnT3Zlcj17dGhpcy5vbkRyYWdPdmVyfVxuICAgICAgb25EcmFnTGVhdmU9e3RoaXMub25EcmFnTGVhdmV9XG4gICAgICBvbkRyb3A9e3RoaXMub25Ecm9wfT5cbiAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIHsuLi50aGF0LnByb3BzfSBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZX0gLz5cbiAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT17dGhhdC5wcm9wcy5uYW1lfSB2YWx1ZT1cIlwiIC8+XG4gICAgICA8SGVhZGVyIHsuLi50aGF0LnByb3BzfSAvPlxuICAgICAge3ByZXZpZXdzfVxuICAgICAge3BsYWNlaG9sZGVyc31cbiAgICAgIHtkaXNjYXJkc31cbiAgICA8L2xhYmVsPlxuICAgIClcbiAgfVxufSlcbiJdfQ==
