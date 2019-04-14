import React, { Component } from 'react';

// Setup CSS Module
// import classNames from 'classnames/bind';
// import style from 'Style/index.scss';
// var cx = classNames.bind(style);

const DEFAULT_STATE = {
  filename: '',
  keystore: null,
  password: ''
}


class KeystoreAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...DEFAULT_STATE
    }

    this.handleChangeFile = this.handleChangeFile.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeFile(e) {
    var self = this;
    var file = e.target.files[0];
    var read = new FileReader();
    read.readAsText(file);
    read.onloadend = function () {
      self.setState({ filename: file.name, keystore: JSON.parse(read.result) });
    }
  }

  handleChangePassword(e) {
    this.setState({ password: e.target.value });
  }

  handleSubmit() {
    this.returnData2Parent();
    // Clear history
    this.setState(DEFAULT_STATE);
  }

  returnData2Parent() {
    this.props.done({
      subType: 'keystore',
      asset: {
        keystore: this.state.keystore,
        password: this.state.password
      }
    });
  }

  render() {
    return (
      <div className="wallet-form">
        <div className="row mb-3">
          <div className="col d-flex">
            <i className="warning" />
            <p className="warning">This is not recommend way to access your wallet.</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col d-flex">
            <p>Upload keystore</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6 col-md-8 col-lg-9">
            <input id="keystore-file" type="file" accept="application/json" onChange={this.handleChangeFile} style={{ "display": "none" }} />
            <input type="text" className="input" value={this.state.filename} disabled></input>
          </div>
          <div className="col-6 col-md-4 col-lg-3">
            <button className="primary-btn" onClick={() => { document.getElementById('keystore-file').click(); }}>Browse</button>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col d-flex">
            <p>Enter password</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input type="password" className="input" placeholder="Password" value={this.state.password} onChange={this.handleChangePassword}></input>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6 col-md-8 col-lg-9 d-flex align-items-end">
            <p className="warning text-bottom"></p>
          </div>
          <div className="col-6 col-md-4 col-lg-3 d-flex">
            <button className="primary-btn" onClick={this.handleSubmit}>OK</button>
          </div>
        </div>
      </div>
    );
  }
}

export default KeystoreAsset;