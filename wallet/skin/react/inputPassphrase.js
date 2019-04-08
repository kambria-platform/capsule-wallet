import React, { Component } from 'react';

// Setup CSS Module
// import classNames from 'classnames/bind';
// import style from 'Style/index.scss';
// var cx = classNames.bind(style);

const DEFAULT_STATE = {
  passphrase: ''
}
const ERROR = 'Used denied to enter passpharse';


class InputPassphrase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      ...DEFAULT_STATE
    }

    this.done = this.props.done;

    this.onClose = this.onClose.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onClose() {
    this.setState({ visible: false });
    this.done(ERROR, null);

    // Clear history
    this.setState(DEFAULT_STATE);
  }

  handleSubmit(e) {
    e.preventDefault()
    this.setState({ visible: false });
    if (!this.state.passphrase) this.done(ERROR, null);
    else this.done(null, this.state.passphrase);

    // Clear history
    this.setState(DEFAULT_STATE);
  }

  onChange(e) {
    this.setState({ passphrase: e.target.value });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({
        visible: this.props.visible,
        ...DEFAULT_STATE
      }, () => {
        // Autofocus
        setTimeout(() => {
          if (this.passpharseName) this.passpharseName.focus();
        }, 1);
      });
    }
  }

  render() {
    return (
      <div className="row align-items-center wallet-body animated zoomIn">
        <div className="col">
          <div className="box-form">

            <div className="row pt-3 mb-3">
              <div className="col">
                <h2>Input Your Passphrase</h2>
              </div>
            </div>

            <div className="wallet-form">

              <div className="row mb-3">
                <div className="col d-flex">
                  <p>Passphrase</p>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-8 col-lg-9">
                  <input type="password" className="input" placeholder="Temporary Passphrase"
                    value={this.state.passphrase}
                    onChange={this.onChange}
                    ref={(name) => { this.passpharseName = name; }}></input>
                </div>
                <div className="col-4 col-lg-3">
                  <button className="primary-btn" onClick={this.handleSubmit}>OK</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default InputPassphrase;