var AttacheFileInput = React.createClass({displayName: "AttacheFileInput",

  getInitialState: function() {
    var files = {};
    if (this.props['data-value']) $.each(JSON.parse(this.props['data-value']), function(uid, json) {
      if (json) files[uid] = json;
    });
    return {files: files, attaches_discarded: [], uploading: 0 };
  },

  onRemove: function(uid, e) {
    e.preventDefault();
    e.stopPropagation();

    var fieldname = this.getDOMNode().firstChild.name;                           // when   'user[avatar]'
    var newfield  = fieldname.replace(/\w+\](\[\]|)$/, 'attaches_discarded][]'); // become 'user[attaches_discarded][]'

    this.state.attaches_discarded.push({ fieldname: newfield, path: this.state.files[uid].path });
    delete this.state.files[uid];

    this.setState(this.state);
  },

  performUpload: function(file_element, files) {
    // user cancelled file chooser dialog. ignore
    if (! files || files.length == 0) return;
    if (! this.props.multiple) {
      this.state.files = {};
      files = [files[0]]; // array of 1 element
    }

    this.setState(this.state);
    // upload the file via CORS
    var that = this;

    that.state.uploading = that.state.uploading + files.length;
    if (! that.state.submit_buttons) that.state.submit_buttons = $("button,input[type='submit']", $(file_element).parents('form')[0]).filter(':not(:disabled)');

    new AttacheCORSUpload({
      file_element: file_element,
      files:        files,
      onComplete:   function() {
        that.state.uploading--;
        that.setFileValue.apply(this, arguments);
      },
      onProgress:   this.setFileValue,
      onError: function(uid, status) {
        that.state.uploading--;
        that.setFileValue(uid, { pctString: '90%', pctDesc: status, className: 'progress-bar progress-bar-danger' });
      }
    });

    // we don't want the file binary to be uploaded in the main form
    // so the actual file input is neutered
    file_element.value = '';
  },

  onChange: function() {
    var file_element = this.getDOMNode().firstChild;
    this.performUpload(file_element, file_element && file_element.files);
  },

  onDragOver: function(e) {
    e.stopPropagation();
    e.preventDefault();
    $(this.getDOMNode()).addClass('attache-dragover');
  },

  onDragLeave: function(e) {
    e.stopPropagation();
    e.preventDefault();
    $(this.getDOMNode()).removeClass('attache-dragover');
  },

  onDrop: function(e) {
    e.stopPropagation();
    e.preventDefault();
    var file_element = this.getDOMNode().firstChild;
    this.performUpload(file_element, e.target.files || e.dataTransfer.files);
    $(this.getDOMNode()).removeClass('attache-dragover');
  },

  setFileValue: function(key, value) {
    this.state.files[key] = value;
    this.setState(this.state);
  },

  render: function() {
    var that = this;

    if (that.state.uploading > 0) {
      that.state.submit_buttons.attr('disabled', true);
    } else if (that.state.submit_buttons) {
      that.state.submit_buttons.attr('disabled', null);
    }

    var Header = eval(this.props['data-header-component'] || 'AttacheHeader');
    var Preview = eval(this.props['data-preview-component'] || 'AttacheFilePreview');
    var Placeholder = eval(this.props['data-placeholder-component'] || 'AttachePlaceholder');

    var previews = [];
    $.each(that.state.files, function(key, result) {
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
      var previewKey = "preview" + key;
      previews.push(
        React.createElement("div", {key: previewKey, className: "attache-file-input"}, 
          React.createElement("input", {type: "hidden", name: that.props.name, value: json, readOnly: "true"}), 
          React.createElement(Preview, React.__spread({},  result, {key: key, onRemove: that.onRemove.bind(that, key)}))
        )
      );
    });

    var placeholders = [];
    if (previews.length == 0 && that.props['data-placeholder']) $.each(JSON.parse(that.props['data-placeholder']), function(uid, src) {
      placeholders.push(
        React.createElement(Placeholder, React.__spread({key: "placeholder"},  that.props, {src: src}))
      );
    });

    var discards = [];
    $.each(that.state.attaches_discarded, function(index, discard) {
      var discardKey = "discard" + discard.path;
      discards.push(
        React.createElement("input", {key: discardKey, type: "hidden", name: discard.fieldname, value: discard.path})
      );
    });

    var className = ["attache-file-selector", "attache-placeholders-count-" + placeholders.length, "attache-previews-count-" + previews.length, this.props['data-classname']].join(' ').trim();
    return (
      React.createElement("label", {htmlFor: that.props.id, className: className, onDragOver: this.onDragOver, onDragLeave: this.onDragLeave, onDrop: this.onDrop}, 
        React.createElement("input", React.__spread({type: "file"},  that.props, {onChange: this.onChange})), 
        React.createElement("input", {type: "hidden", name: that.props.name, value: ""}), 
        React.createElement(Header, React.__spread({},  that.props)), 
        previews, 
        placeholders, 
        discards
      )
    );
  }
});
