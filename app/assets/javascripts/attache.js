(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
/*global React*/

var Bootstrap3FilePreview = exports.Bootstrap3FilePreview = React.createClass({
  displayName: 'Bootstrap3FilePreview',
  getInitialState: function getInitialState() {
    return { srcWas: '' };
  },
  onSrcLoaded: function onSrcLoaded() {
    this.setState({ srcWas: this.props.src });
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
      var img = React.createElement('img', { src: this.props.src, onLoad: this.onSrcLoaded });
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

},{"./bootstrap3":2,"./cors_upload":3}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjQuMS4wL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL2phdmFzY3JpcHRzL2F0dGFjaGUuanMiLCJzcmMvamF2YXNjcmlwdHMvYXR0YWNoZS9ib290c3RyYXAzLmpzIiwic3JjL2phdmFzY3JpcHRzL2F0dGFjaGUvY29yc191cGxvYWQuanMiLCJzcmMvamF2YXNjcmlwdHMvYXR0YWNoZS9maWxlX2lucHV0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ01BLElBQUksZ0JBQWdCLEdBQUcsU0FBbkIsZ0JBQWdCLEdBQWU7QUFDakMsTUFBSSxTQUFTLEdBQUcsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQTtBQUMxRCxNQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsc0JBQXNCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtBQUMzRCxNQUFJLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQTtBQUMzQixPQUFLLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDeEMsT0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNaLFNBQUssR0FBRyxFQUFFLENBQUE7QUFDVixTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDOUMsVUFBSSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO0FBQzdCLFdBQUssR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQTtBQUMvQixVQUFJLElBQUks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S0FBSyxFQUFDLEVBQUUsR0FBRztNQUN2RCxvQkFBQyxNQUFNLEVBQUssSUFBSSxDQUFDLEtBQUssQ0FBSTtNQUN6QixRQUFRO01BQ1IsWUFBWTtNQUNaLFFBQVE7S0FDSCxDQUNQO0dBQ0Y7Q0FDRixDQUFDLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypnbG9iYWwgJCovXG4vKmdsb2JhbCBSZWFjdCovXG4vKmdsb2JhbCBSZWFjdERPTSovXG5cbmltcG9ydCB7IEF0dGFjaGVGaWxlSW5wdXQgfSBmcm9tICcuL2F0dGFjaGUvZmlsZV9pbnB1dCdcblxudmFyIHVwZ3JhZGVGaWxlSW5wdXQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzYWZlV29yZHMgPSB7ICdjbGFzcyc6ICdjbGFzc05hbWUnLCAnZm9yJzogJ2h0bWxGb3InIH1cbiAgdmFyIHNlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2VuYWJsZS1hdHRhY2hlJylcbiAgdmFyIGVsZSwgYXR0cnMsIG5hbWUsIHZhbHVlXG4gIGZvciAodmFyIGkgPSBzZWwubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBlbGUgPSBzZWxbaV1cbiAgICBhdHRycyA9IHt9XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBlbGUuYXR0cmlidXRlcy5sZW5ndGg7IGorKykge1xuICAgICAgbmFtZSA9IGVsZS5hdHRyaWJ1dGVzW2pdLm5hbWVcbiAgICAgIHZhbHVlID0gZWxlLmF0dHJpYnV0ZXNbal0udmFsdWVcbiAgICAgIGlmIChuYW1lID09PSAnY2xhc3MnKSB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoJ2VuYWJsZS1hdHRhY2hlJywgJ2F0dGFjaGUtZW5hYmxlZCcpXG4gICAgICBuYW1lID0gc2FmZVdvcmRzW25hbWVdIHx8IG5hbWVcbiAgICAgIGF0dHJzW25hbWVdID0gdmFsdWVcbiAgICB9XG4gICAgdmFyIHdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGVsZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZCh3cmFwLCBlbGUpXG4gICAgUmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQXR0YWNoZUZpbGVJbnB1dCwgUmVhY3QuX19zcHJlYWQoe30sIGF0dHJzKSksIHdyYXApXG4gIH1cbn1cblxuJChkb2N1bWVudCkub24oJ3BhZ2U6Y2hhbmdlJywgdXBncmFkZUZpbGVJbnB1dClcbiQodXBncmFkZUZpbGVJbnB1dClcbiIsIi8qZ2xvYmFsIFJlYWN0Ki9cblxuZXhwb3J0IHZhciBCb290c3RyYXAzRmlsZVByZXZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZSAoKSB7XG4gICAgcmV0dXJuIHsgc3JjV2FzOiAnJyB9XG4gIH0sXG5cbiAgb25TcmNMb2FkZWQgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzcmNXYXM6IHRoaXMucHJvcHMuc3JjIH0pXG4gIH0sXG5cbiAgcmVuZGVyICgpIHtcbiAgICB2YXIgcHJldmlld0NsYXNzTmFtZSA9ICdhdHRhY2hlLWZpbGUtcHJldmlldydcblxuICAgIC8vIHByb2dyZXNzYmFyXG4gICAgaWYgKHRoaXMuc3RhdGUuc3JjV2FzICE9PSB0aGlzLnByb3BzLnNyYykge1xuICAgICAgcHJldmlld0NsYXNzTmFtZSA9IHByZXZpZXdDbGFzc05hbWUgKyAnIGF0dGFjaGUtbG9hZGluZydcbiAgICAgIHZhciBjbGFzc05hbWUgPSB0aGlzLnByb3BzLmNsYXNzTmFtZSB8fCAncHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci1zdHJpcGVkIGFjdGl2ZScgKyAodGhpcy5wcm9wcy5zcmMgPyAnIHByb2dyZXNzLWJhci1zdWNjZXNzJyA6ICcnKVxuICAgICAgdmFyIHBjdFN0cmluZyA9IHRoaXMucHJvcHMucGN0U3RyaW5nIHx8ICh0aGlzLnByb3BzLnNyYyA/IDEwMCA6IHRoaXMucHJvcHMucGVyY2VudExvYWRlZCkgKyAnJSdcbiAgICAgIHZhciBwY3REZXNjID0gdGhpcy5wcm9wcy5wY3REZXNjIHx8ICh0aGlzLnByb3BzLnNyYyA/ICdMb2FkaW5nLi4uJyA6IHBjdFN0cmluZylcbiAgICAgIHZhciBwY3RTdHlsZSA9IHsgd2lkdGg6IHBjdFN0cmluZywgbWluV2lkdGg6ICczZW0nIH1cbiAgICAgIHZhciBwcm9ncmVzcyA9IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZ3Jlc3NcIj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuICAgICAgICAgIHJvbGU9XCJwcm9ncmVzc2JhclwiXG4gICAgICAgICAgYXJpYS12YWx1ZW5vdz17dGhpcy5wcm9wcy5wZXJjZW50TG9hZGVkfVxuICAgICAgICAgIGFyaWEtdmFsdWVtaW49XCIwXCJcbiAgICAgICAgICBhcmlhLXZhbHVlbWF4PVwiMTAwXCJcbiAgICAgICAgICBzdHlsZT17cGN0U3R5bGV9PlxuICAgICAgICAgIHtwY3REZXNjfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIC8vIGltZyB0YWdcbiAgICBpZiAodGhpcy5wcm9wcy5zcmMpIHtcbiAgICAgIHZhciBpbWcgPSA8aW1nIHNyYz17dGhpcy5wcm9wcy5zcmN9IG9uTG9hZD17dGhpcy5vblNyY0xvYWRlZH0gLz5cbiAgICB9XG5cbiAgICAvLyBjb21iaW5lZFxuICAgIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e3ByZXZpZXdDbGFzc05hbWV9PlxuICAgICAge3Byb2dyZXNzfVxuICAgICAge2ltZ31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xlYXJmaXhcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdWxsLWxlZnRcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5maWxlbmFtZX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxhXG4gICAgICAgICAgaHJlZj1cIiNyZW1vdmVcIlxuICAgICAgICAgIGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIlxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMucHJvcHMub25SZW1vdmV9XG4gICAgICAgICAgdGl0bGU9XCJDbGljayB0byByZW1vdmVcIj4mdGltZXM7PC9hPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgKVxuICB9XG59KVxuXG5leHBvcnQgdmFyIEJvb3RzdHJhcDNQbGFjZWhvbGRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiYXR0YWNoZS1maWxlLXByZXZpZXdcIj5cbiAgICAgIDxpbWcgc3JjPXt0aGlzLnByb3BzLnNyY30gLz5cbiAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn0pXG5cbmV4cG9ydCB2YXIgQm9vdHN0cmFwM0hlYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgIDxub3NjcmlwdCAvPlxuICAgIClcbiAgfVxufSlcbiIsIi8qZ2xvYmFsICQqL1xuLypnbG9iYWwgYWxlcnQqL1xuLypnbG9iYWwgWE1MSHR0cFJlcXVlc3QqL1xuLypnbG9iYWwgWERvbWFpblJlcXVlc3QqL1xuXG52YXIgY291bnRlciA9IDBcblxuZXhwb3J0IGNsYXNzIENPUlNVcGxvYWQge1xuICBjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09IG51bGwpIG9wdGlvbnMgPSB7fVxuICAgIHZhciBvcHRpb25cbiAgICBmb3IgKG9wdGlvbiBpbiBvcHRpb25zKSB7XG4gICAgICB0aGlzW29wdGlvbl0gPSBvcHRpb25zW29wdGlvbl1cbiAgICB9XG4gIH1cblxuICAvLyBmb3Igb3ZlcndyaXRpbmdcbiAgY3JlYXRlTG9jYWxUaHVtYm5haWwgKCkgeyB9XG4gIG9uQ29tcGxldGUgKHVpZCwganNvbikgeyB9XG4gIG9uUHJvZ3Jlc3MgKHVpZCwganNvbikgeyB9XG4gIG9uRXJyb3IgKHVpZCwgc3RhdHVzKSB7IGFsZXJ0KHN0YXR1cykgfVxuXG4gIGhhbmRsZUZpbGVTZWxlY3QgKCkge1xuICAgIHZhciBmLCBfaSwgX2xlbiwgX3Jlc3VsdHMsIHVybCwgJGVsZSwgcHJlZml4XG4gICAgJGVsZSA9ICQodGhpcy5maWxlX2VsZW1lbnQpXG4gICAgdXJsID0gJGVsZS5kYXRhKCd1cGxvYWR1cmwnKVxuICAgIGlmICgkZWxlLmRhdGEoJ2htYWMnKSkge1xuICAgICAgdXJsID0gdXJsICtcbiAgICAgICAgJz9obWFjPScgKyBlbmNvZGVVUklDb21wb25lbnQoJGVsZS5kYXRhKCdobWFjJykpICtcbiAgICAgICAgJyZ1dWlkPScgKyBlbmNvZGVVUklDb21wb25lbnQoJGVsZS5kYXRhKCd1dWlkJykpICtcbiAgICAgICAgJyZleHBpcmF0aW9uPScgKyBlbmNvZGVVUklDb21wb25lbnQoJGVsZS5kYXRhKCdleHBpcmF0aW9uJykpICtcbiAgICAgICAgJydcbiAgICB9XG5cbiAgICBwcmVmaXggPSBEYXRlLm5vdygpICsgJ18nXG4gICAgX3Jlc3VsdHMgPSBbXVxuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gdGhpcy5maWxlcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgZiA9IHRoaXMuZmlsZXNbX2ldXG4gICAgICB0aGlzLmNyZWF0ZUxvY2FsVGh1bWJuYWlsKGYpIC8vIGlmIGFueVxuICAgICAgZi51aWQgPSBwcmVmaXggKyAoY291bnRlcisrKVxuICAgICAgdGhpcy5vblByb2dyZXNzKGYudWlkLCB7IHNyYzogZi5zcmMsIGZpbGVuYW1lOiBmLm5hbWUsIHBlcmNlbnRMb2FkZWQ6IDAsIGJ5dGVzTG9hZGVkOiAwLCBieXRlc1RvdGFsOiBmLnNpemUgfSlcbiAgICAgIF9yZXN1bHRzLnB1c2godGhpcy5wZXJmb3JtVXBsb2FkKGYsIHVybCkpXG4gICAgfVxuICAgIHJldHVybiBfcmVzdWx0c1xuICB9XG5cbiAgY3JlYXRlQ09SU1JlcXVlc3QgKG1ldGhvZCwgdXJsKSB7XG4gICAgdmFyIHhoclxuICAgIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgaWYgKHhoci53aXRoQ3JlZGVudGlhbHMgIT0gbnVsbCkge1xuICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgWERvbWFpblJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB4aHIgPSBuZXcgWERvbWFpblJlcXVlc3QoKVxuICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHhociA9IG51bGxcbiAgICB9XG4gICAgcmV0dXJuIHhoclxuICB9XG5cbiAgcGVyZm9ybVVwbG9hZCAoZmlsZSwgdXJsKSB7XG4gICAgdmFyIHRoaXNfczN1cGxvYWQsIHhoclxuICAgIHRoaXNfczN1cGxvYWQgPSB0aGlzXG4gICAgdXJsID0gdXJsICsgKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArICdmaWxlPScgKyBlbmNvZGVVUklDb21wb25lbnQoZmlsZS5uYW1lKVxuICAgIHhociA9IHRoaXMuY3JlYXRlQ09SU1JlcXVlc3QoJ1BVVCcsIHVybClcbiAgICBpZiAoIXhocikge1xuICAgICAgdGhpcy5vbkVycm9yKGZpbGUudWlkLCAnQ09SUyBub3Qgc3VwcG9ydGVkJylcbiAgICB9IGVsc2Uge1xuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICB0aGlzX3MzdXBsb2FkLm9uQ29tcGxldGUoZmlsZS51aWQsIEpTT04ucGFyc2UoZS50YXJnZXQucmVzcG9uc2VUZXh0KSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpc19zM3VwbG9hZC5vbkVycm9yKGZpbGUudWlkLCB4aHIuc3RhdHVzICsgJyAnICsgeGhyLnN0YXR1c1RleHQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpc19zM3VwbG9hZC5vbkVycm9yKGZpbGUudWlkLCAnVW5hYmxlIHRvIHJlYWNoIHNlcnZlcicpXG4gICAgICB9XG4gICAgICB4aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgcGVyY2VudExvYWRlZFxuICAgICAgICBpZiAoZS5sZW5ndGhDb21wdXRhYmxlKSB7XG4gICAgICAgICAgcGVyY2VudExvYWRlZCA9IE1hdGgucm91bmQoKGUubG9hZGVkIC8gZS50b3RhbCkgKiAxMDApXG4gICAgICAgICAgcmV0dXJuIHRoaXNfczN1cGxvYWQub25Qcm9ncmVzcyhmaWxlLnVpZCwgeyBzcmM6IGZpbGUuc3JjLCBmaWxlbmFtZTogZmlsZS5uYW1lLCBwZXJjZW50TG9hZGVkOiBwZXJjZW50TG9hZGVkLCBieXRlc0xvYWRlZDogZS5sb2FkZWQsIGJ5dGVzVG90YWw6IGUudG90YWwgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geGhyLnNlbmQoZmlsZSlcbiAgfVxufVxuIiwiLypnbG9iYWwgJCovXG4vKmdsb2JhbCB3aW5kb3cqL1xuLypnbG9iYWwgUmVhY3QqL1xuLypnbG9iYWwgUmVhY3RET00qL1xuXG5pbXBvcnQgeyBDT1JTVXBsb2FkIH0gZnJvbSAnLi9jb3JzX3VwbG9hZCdcbmltcG9ydCB7IEJvb3RzdHJhcDNIZWFkZXIsIEJvb3RzdHJhcDNGaWxlUHJldmlldywgQm9vdHN0cmFwM1BsYWNlaG9sZGVyIH0gZnJvbSAnLi9ib290c3RyYXAzJ1xuXG5leHBvcnQgdmFyIEF0dGFjaGVGaWxlSW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZSAoKSB7XG4gICAgdmFyIGZpbGVzID0ge31cbiAgICBpZiAodGhpcy5wcm9wc1snZGF0YS12YWx1ZSddKSB7XG4gICAgICAkLmVhY2goSlNPTi5wYXJzZSh0aGlzLnByb3BzWydkYXRhLXZhbHVlJ10pLCBmdW5jdGlvbiAodWlkLCBqc29uKSB7XG4gICAgICAgIGlmIChqc29uKSBmaWxlc1t1aWRdID0ganNvblxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHsgZmlsZXM6IGZpbGVzLCBhdHRhY2hlc19kaXNjYXJkZWQ6IFtdLCB1cGxvYWRpbmc6IDAgfVxuICB9LFxuXG4gIG9uUmVtb3ZlICh1aWQsIGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICB2YXIgZmllbGRuYW1lID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcykuZmlyc3RDaGlsZC5uYW1lIC8vIHdoZW4gICAndXNlclthdmF0YXJdJ1xuICAgIHZhciBuZXdmaWVsZCA9IGZpZWxkbmFtZS5yZXBsYWNlKC9cXHcrXFxdKFxcW1xcXXwpJC8sICdhdHRhY2hlc19kaXNjYXJkZWRdW10nKSAvLyBiZWNvbWUgJ3VzZXJbYXR0YWNoZXNfZGlzY2FyZGVkXVtdJ1xuXG4gICAgdGhpcy5zdGF0ZS5hdHRhY2hlc19kaXNjYXJkZWQucHVzaCh7IGZpZWxkbmFtZTogbmV3ZmllbGQsIHBhdGg6IHRoaXMuc3RhdGUuZmlsZXNbdWlkXS5wYXRoIH0pXG4gICAgZGVsZXRlIHRoaXMuc3RhdGUuZmlsZXNbdWlkXVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlKVxuICB9LFxuXG4gIHBlcmZvcm1VcGxvYWQgKGZpbGVfZWxlbWVudCwgZmlsZXMpIHtcbiAgICAvLyB1c2VyIGNhbmNlbGxlZCBmaWxlIGNob29zZXIgZGlhbG9nLiBpZ25vcmVcbiAgICBpZiAoIWZpbGVzIHx8IGZpbGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG4gICAgaWYgKCF0aGlzLnByb3BzLm11bHRpcGxlKSB7XG4gICAgICB0aGlzLnN0YXRlLmZpbGVzID0ge31cbiAgICAgIGZpbGVzID0gW2ZpbGVzWzBdXSAvLyBhcnJheSBvZiAxIGVsZW1lbnRcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUpXG4gICAgLy8gdXBsb2FkIHRoZSBmaWxlIHZpYSBDT1JTXG4gICAgdmFyIHRoYXQgPSB0aGlzXG5cbiAgICB0aGF0LnN0YXRlLnVwbG9hZGluZyA9IHRoYXQuc3RhdGUudXBsb2FkaW5nICsgZmlsZXMubGVuZ3RoXG4gICAgaWYgKCF0aGF0LnN0YXRlLnN1Ym1pdF9idXR0b25zKSB0aGF0LnN0YXRlLnN1Ym1pdF9idXR0b25zID0gJChcImJ1dHRvbixpbnB1dFt0eXBlPSdzdWJtaXQnXVwiLCAkKGZpbGVfZWxlbWVudCkucGFyZW50cygnZm9ybScpWzBdKS5maWx0ZXIoJzpub3QoOmRpc2FibGVkKScpXG5cbiAgICB2YXIgdXBsb2FkID0gbmV3IENPUlNVcGxvYWQoe1xuICAgICAgZmlsZV9lbGVtZW50OiBmaWxlX2VsZW1lbnQsXG4gICAgICBmaWxlczogZmlsZXMsXG4gICAgICBvblByb2dyZXNzOiB0aGlzLnNldEZpbGVWYWx1ZSxcbiAgICAgIG9uQ29tcGxldGUgKCkge1xuICAgICAgICB0aGF0LnN0YXRlLnVwbG9hZGluZy0tXG4gICAgICAgIHRoYXQuc2V0RmlsZVZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgIH0sXG4gICAgICBvbkVycm9yICh1aWQsIHN0YXR1cykge1xuICAgICAgICB0aGF0LnN0YXRlLnVwbG9hZGluZy0tXG4gICAgICAgIHRoYXQuc2V0RmlsZVZhbHVlKHVpZCwgeyBwY3RTdHJpbmc6ICc5MCUnLCBwY3REZXNjOiBzdGF0dXMsIGNsYXNzTmFtZTogJ3Byb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItZGFuZ2VyJyB9KVxuICAgICAgfVxuICAgIH0pXG4gICAgdXBsb2FkLmhhbmRsZUZpbGVTZWxlY3QoKVxuXG4gICAgLy8gd2UgZG9uJ3Qgd2FudCB0aGUgZmlsZSBiaW5hcnkgdG8gYmUgdXBsb2FkZWQgaW4gdGhlIG1haW4gZm9ybVxuICAgIC8vIHNvIHRoZSBhY3R1YWwgZmlsZSBpbnB1dCBpcyBuZXV0ZXJlZFxuICAgIGZpbGVfZWxlbWVudC52YWx1ZSA9ICcnXG4gIH0sXG5cbiAgb25DaGFuZ2UgKCkge1xuICAgIHZhciBmaWxlX2VsZW1lbnQgPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKS5maXJzdENoaWxkXG4gICAgdGhpcy5wZXJmb3JtVXBsb2FkKGZpbGVfZWxlbWVudCwgZmlsZV9lbGVtZW50ICYmIGZpbGVfZWxlbWVudC5maWxlcylcbiAgfSxcblxuICBvbkRyYWdPdmVyIChlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICQoUmVhY3RET00uZmluZERPTU5vZGUodGhpcykpLmFkZENsYXNzKCdhdHRhY2hlLWRyYWdvdmVyJylcbiAgfSxcblxuICBvbkRyYWdMZWF2ZSAoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpKS5yZW1vdmVDbGFzcygnYXR0YWNoZS1kcmFnb3ZlcicpXG4gIH0sXG5cbiAgb25Ecm9wIChlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIHZhciBmaWxlX2VsZW1lbnQgPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKS5maXJzdENoaWxkXG4gICAgdGhpcy5wZXJmb3JtVXBsb2FkKGZpbGVfZWxlbWVudCwgZS50YXJnZXQuZmlsZXMgfHwgZS5kYXRhVHJhbnNmZXIuZmlsZXMpXG4gICAgJChSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSkucmVtb3ZlQ2xhc3MoJ2F0dGFjaGUtZHJhZ292ZXInKVxuICB9LFxuXG4gIHNldEZpbGVWYWx1ZSAoa2V5LCB2YWx1ZSkge1xuICAgIHRoaXMuc3RhdGUuZmlsZXNba2V5XSA9IHZhbHVlXG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlKVxuICB9LFxuXG4gIHJlbmRlciAoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgdmFyIEhlYWRlciA9IHdpbmRvdy5BdHRhY2hlSGVhZGVyIHx8IEJvb3RzdHJhcDNIZWFkZXJcbiAgICB2YXIgRmlsZVByZXZpZXcgPSB3aW5kb3cuQXR0YWNoZUZpbGVQcmV2aWV3IHx8IEJvb3RzdHJhcDNGaWxlUHJldmlld1xuICAgIHZhciBQbGFjZWhvbGRlciA9IHdpbmRvdy5BdHRhY2hlUGxhY2Vob2xkZXIgfHwgQm9vdHN0cmFwM1BsYWNlaG9sZGVyXG5cbiAgICBpZiAodGhhdC5zdGF0ZS51cGxvYWRpbmcgPiAwKSB7XG4gICAgICB0aGF0LnN0YXRlLnN1Ym1pdF9idXR0b25zLmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSlcbiAgICB9IGVsc2UgaWYgKHRoYXQuc3RhdGUuc3VibWl0X2J1dHRvbnMpIHtcbiAgICAgIHRoYXQuc3RhdGUuc3VibWl0X2J1dHRvbnMuYXR0cignZGlzYWJsZWQnLCBudWxsKVxuICAgIH1cblxuICAgIHZhciBwcmV2aWV3cyA9IFtdXG4gICAgJC5lYWNoKHRoYXQuc3RhdGUuZmlsZXMsIGZ1bmN0aW9uIChrZXksIHJlc3VsdCkge1xuICAgICAgLy8ganNvbiBpcyBpbnB1dFt2YWx1ZV0sIGRyb3Agbm9uIGVzc2VudGlhbCB2YWx1ZXNcbiAgICAgIHZhciBjb3B5ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHQpKVxuICAgICAgZGVsZXRlIGNvcHkuc3JjXG4gICAgICBkZWxldGUgY29weS5maWxlbmFtZVxuICAgICAgdmFyIGpzb24gPSBKU09OLnN0cmluZ2lmeShjb3B5KVxuICAgICAgLy9cbiAgICAgIHJlc3VsdC5tdWx0aXBsZSA9IHRoYXQucHJvcHMubXVsdGlwbGVcbiAgICAgIGlmIChyZXN1bHQucGF0aCkge1xuICAgICAgICB2YXIgcGFydHMgPSByZXN1bHQucGF0aC5zcGxpdCgnLycpXG4gICAgICAgIHJlc3VsdC5maWxlbmFtZSA9IHBhcnRzLnBvcCgpLnNwbGl0KC9bIz9dLykuc2hpZnQoKVxuICAgICAgICBwYXJ0cy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudCh0aGF0LnByb3BzWydkYXRhLWdlb21ldHJ5J10gfHwgJzEyOHgxMjgjJykpXG4gICAgICAgIHBhcnRzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KHJlc3VsdC5maWxlbmFtZSkpXG4gICAgICAgIHJlc3VsdC5zcmMgPSB0aGF0LnByb3BzWydkYXRhLWRvd25sb2FkdXJsJ10gKyAnLycgKyBwYXJ0cy5qb2luKCcvJylcbiAgICAgIH1cbiAgICAgIHZhciBwcmV2aWV3S2V5ID0gJ3ByZXZpZXcnICsga2V5XG4gICAgICBwcmV2aWV3cy5wdXNoKFxuICAgICAgICA8ZGl2IGtleT17cHJldmlld0tleX0gY2xhc3NOYW1lPVwiYXR0YWNoZS1maWxlLWlucHV0XCI+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0eXBlPVwiaGlkZGVuXCJcbiAgICAgICAgICAgIG5hbWU9e3RoYXQucHJvcHMubmFtZX1cbiAgICAgICAgICAgIHZhbHVlPXtqc29ufVxuICAgICAgICAgICAgcmVhZE9ubHk9XCJ0cnVlXCIgLz5cbiAgICAgICAgICA8RmlsZVByZXZpZXcgey4uLnJlc3VsdH0ga2V5PXtrZXl9IG9uUmVtb3ZlPXt0aGF0Lm9uUmVtb3ZlLmJpbmQodGhhdCwga2V5KX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSlcblxuICAgIHZhciBwbGFjZWhvbGRlcnMgPSBbXVxuICAgIGlmIChwcmV2aWV3cy5sZW5ndGggPT09IDAgJiYgdGhhdC5wcm9wc1snZGF0YS1wbGFjZWhvbGRlciddKSB7XG4gICAgICAkLmVhY2goSlNPTi5wYXJzZSh0aGF0LnByb3BzWydkYXRhLXBsYWNlaG9sZGVyJ10pLCBmdW5jdGlvbiAodWlkLCBzcmMpIHtcbiAgICAgICAgcGxhY2Vob2xkZXJzLnB1c2goXG4gICAgICAgICAgPFBsYWNlaG9sZGVyIGtleT1cInBsYWNlaG9sZGVyXCIgey4uLnRoYXQucHJvcHN9IHNyYz17c3JjfSAvPlxuICAgICAgICApXG4gICAgICB9KVxuICAgIH1cblxuICAgIHZhciBkaXNjYXJkcyA9IFtdXG4gICAgJC5lYWNoKHRoYXQuc3RhdGUuYXR0YWNoZXNfZGlzY2FyZGVkLCBmdW5jdGlvbiAoaW5kZXgsIGRpc2NhcmQpIHtcbiAgICAgIHZhciBkaXNjYXJkS2V5ID0gJ2Rpc2NhcmQnICsgZGlzY2FyZC5wYXRoXG4gICAgICBkaXNjYXJkcy5wdXNoKFxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBrZXk9e2Rpc2NhcmRLZXl9XG4gICAgICAgICAgdHlwZT1cImhpZGRlblwiXG4gICAgICAgICAgbmFtZT17ZGlzY2FyZC5maWVsZG5hbWV9XG4gICAgICAgICAgdmFsdWU9e2Rpc2NhcmQucGF0aH0gLz5cbiAgICAgIClcbiAgICB9KVxuXG4gICAgdmFyIGNsYXNzTmFtZSA9IFsnYXR0YWNoZS1maWxlLXNlbGVjdG9yJywgJ2F0dGFjaGUtcGxhY2Vob2xkZXJzLWNvdW50LScgKyBwbGFjZWhvbGRlcnMubGVuZ3RoLCAnYXR0YWNoZS1wcmV2aWV3cy1jb3VudC0nICsgcHJldmlld3MubGVuZ3RoLCB0aGlzLnByb3BzWydkYXRhLWNsYXNzbmFtZSddXS5qb2luKCcgJykudHJpbSgpXG4gICAgcmV0dXJuIChcbiAgICA8bGFiZWxcbiAgICAgIGh0bWxGb3I9e3RoYXQucHJvcHMuaWR9XG4gICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICAgIG9uRHJhZ092ZXI9e3RoaXMub25EcmFnT3Zlcn1cbiAgICAgIG9uRHJhZ0xlYXZlPXt0aGlzLm9uRHJhZ0xlYXZlfVxuICAgICAgb25Ecm9wPXt0aGlzLm9uRHJvcH0+XG4gICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiB7Li4udGhhdC5wcm9wc30gb25DaGFuZ2U9e3RoaXMub25DaGFuZ2V9IC8+XG4gICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9e3RoYXQucHJvcHMubmFtZX0gdmFsdWU9XCJcIiAvPlxuICAgICAgPEhlYWRlciB7Li4udGhhdC5wcm9wc30gLz5cbiAgICAgIHtwcmV2aWV3c31cbiAgICAgIHtwbGFjZWhvbGRlcnN9XG4gICAgICB7ZGlzY2FyZHN9XG4gICAgPC9sYWJlbD5cbiAgICApXG4gIH1cbn0pXG4iXX0=
