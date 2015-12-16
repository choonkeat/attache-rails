/*global $*/
/*global React*/

export var Bootstrap3FilePreview = React.createClass({
  getInitialState () {
    return { srcWas: '' }
  },

  onSrcLoaded (event) {
    this.setState({ srcWas: this.props.src })
    $(event.target).trigger('attache:imgload')
  },

  onSrcError (event) {
    $(event.target).trigger('attache:imgerror')
  },

  render () {
    var previewClassName = 'attache-file-preview'

    // progressbar
    if (this.state.srcWas !== this.props.src) {
      previewClassName = previewClassName + ' attache-loading'
      var className = this.props.className || 'progress-bar progress-bar-striped active' + (this.props.src ? ' progress-bar-success' : '')
      var pctString = this.props.pctString || (this.props.src ? 100 : this.props.percentLoaded) + '%'
      var pctDesc = this.props.pctDesc || (this.props.src ? 'Loading...' : pctString)
      var pctStyle = { width: pctString, minWidth: '3em' }
      var progress = (
      <div className="progress">
        <div
          className={className}
          role="progressbar"
          aria-valuenow={this.props.percentLoaded}
          aria-valuemin="0"
          aria-valuemax="100"
          style={pctStyle}>
          {pctDesc}
        </div>
      </div>
      )
    }

    // img tag
    if (this.props.src) {
      var img = <img src={this.props.src} onLoad={this.onSrcLoaded} onError={this.onSrcError} />
    }

    // combined
    return (
    <div className={previewClassName}>
      {progress}
      {img}
      <div className="clearfix">
        <div className="pull-left">
          {this.props.filename}
        </div>
        <a
          href="#remove"
          className="pull-right"
          onClick={this.props.onRemove}
          title="Click to remove">&times;</a>
      </div>
    </div>
    )
  }
})

export var Bootstrap3Placeholder = React.createClass({
  render () {
    return (
    <div className="attache-file-preview">
      <img src={this.props.src} />
    </div>
    )
  }
})

export var Bootstrap3Header = React.createClass({
  render () {
    return (
    <noscript />
    )
  }
})
