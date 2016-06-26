(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.attache_file_input = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*global $*/
/*global window*/
/*global React*/
/*global ReactDOM*/
/*global attache_bootstrap3 */
/*global attache_cors_upload */

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

    var upload = new attache_cors_upload.CORSUpload({
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
    var Header = window.AttacheHeader || attache_bootstrap3.Bootstrap3Header;
    var FilePreview = window.AttacheFilePreview || attache_bootstrap3.Bootstrap3FilePreview;
    var Placeholder = window.AttachePlaceholder || attache_bootstrap3.Bootstrap3Placeholder;

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
      delete copy.multiple;
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

},{}]},{},[1])(1)
});