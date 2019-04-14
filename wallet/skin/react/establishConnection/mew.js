import React, { Component } from 'react';

var MEW = require('../../../lib/mew');

// Setup CSS Module
// import classNames from 'classnames/bind';
// import style from 'Style/index.scss';
// var cx = classNames.bind(style);

const STATUS = {
  INIT: 'Please using MyEtherWallet application on your phone to scan and establish the connection!',
  TEST: 'Waiting for the connection',
  FAIL: 'Cannot connect the devide!'
}


class MewAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: STATUS.INIT,
    }

    this.mew = new MEW(window.capsuleWallet.net, 'hybridwallet', true);
    this.establishTheConnection = this.establishTheConnection.bind(this);
  }

  establishTheConnection() {
    this.mew.setAccountByMEW(window.capsuleWallet.getAuthentication, (er, data) => {
      if (er) return this.setState({ message: STATUS.FAIL });
      return this.props.done({ subType: 'mew', provider: this.mew });
    });
  }

  render() {
    return (
      <div className="wallet-form">
        <div className="row mb-3">
          <div className="col d-flex">
            <i className="checked" />
            <p className="checked">This is a recommend way to access your wallet.</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6 col-md-8 col-lg-9 d-flex align-items-end">
            <p className={"text-left" + (this.state.message === STATUS.FAIL ? " warning" : "")}>{this.state.message}</p>
          </div>
          <div className="col-6 col-md-4 col-lg-3 d-flex align-items-end">
            <button className="primary-btn" onClick={this.establishTheConnection}>Connect</button>
          </div>
        </div>
      </div>
    );
  }
}

export default MewAsset;