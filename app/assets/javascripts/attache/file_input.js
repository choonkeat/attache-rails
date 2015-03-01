var AttacheFileInput = React.createClass({displayName: "AttacheFileInput",

  getInitialState: function() {
    var files = {};
    var array = ([].concat(JSON.parse(this.props['data-value'])));
    $.each(array, function(uid, json) {
      if (json) files[uid] = { path: json };
    });
    return {files: files};
  },

  onRemove: function(uid, e) {
    delete this.state.files[uid];
    this.setState(this.state);
    e.preventDefault();
    e.stopPropagation();
  },

  onChange: function() {
    var file_element = this.getDOMNode().firstChild;
    // user cancelled file chooser dialog. ignore
    if (file_element.files.length == 0) return;
    this.state.files = {};
    this.setState(this.state);
    // upload the file via CORS
    var that = this;
    new AttacheCORSUpload({
      file_element: file_element,
      onComplete:   this.setFileValue,
      onProgress:   this.setFileValue,
      onError: function(uid, status) {
        that.setFileValue(uid, { pctString: '90%', pctDesc: status, className: 'progress-bar progress-bar-danger' });
      }
    });

    // we don't want the file binary to be uploaded in the main form
    // so the actual file input is neutered
    file_element.value = '';
  },

  setFileValue: function(key, value) {
    this.state.files[key] = value;
    this.setState(this.state);
  },

  render: function() {
    var that = this;
    var previews = [];
    $.each(that.state.files, function(key, result) {
      var json = JSON.stringify(result);
      if (result.path) {
        var parts = result.path.split('/');
        parts.splice(parts.length-1, 0, encodeURIComponent(that.props['data-geometry'] || '128x128#'));
        result.src = that.props['data-downloadurl'] + '/' + parts.join('/');
        result.filename = result.src.split('/').pop().split(/[#?]/).shift();
      }
      previews.push(
        React.createElement("div", {className: "attache-file-input"}, 
          React.createElement("input", {type: "hidden", name: that.props.name, value: result.path, readOnly: "true"}), 
          React.createElement(AttacheFilePreview, React.__spread({},  result, {key: key, onRemove: that.onRemove.bind(that, key)}))
        )
      );
    });
    return (
      React.createElement("label", {htmlFor: this.props.id, className: "attache-file-selector"}, 
        React.createElement("input", React.__spread({type: "file"},  this.props, {onChange: this.onChange})), 
        previews
      )
    );
  }
});
