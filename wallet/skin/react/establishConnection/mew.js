import React, { Component } from 'react';

var { MEW } = require('capsule-core-js');

// Setup CSS Module
import classNames from 'classnames/bind';
import style from '../../static/style/index.module.css';
var cx = classNames.bind(style);

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

    this.mew = new MEW(window.capsuleWallet.networkId, 'hybridwallet', true);
    this.establishTheConnection = this.establishTheConnection.bind(this);
  }

  establishTheConnection() {
    this.mew.setAccountByMEW(window.capsuleWallet.getAuthentication, (er, data) => {
      if (er) return this.setState({ message: STATUS.FAIL });
      return this.props.done({ wallet: 'mew', model: 'mew', provider: this.mew });
    });
  }

  render() {
    return (
      <div className={cx("wallet-form")}>
        <div className={cx("row", "mb-3")}>
          <div className={cx("col", "d-flex")}>
            <i className={cx("checked")} />
            <p className={cx("checked")}>This is a recommend way to access your wallet.</p>
          </div>
        </div>
        <div className={cx("row", "mb-3")}>
          <div className={cx("col-6", "col-md-8", "col-lg-9", "d-flex", "align-items-end")}>
            <p className={cx("text-left", { "warning": this.state.message === STATUS.FAIL })}>{this.state.message}</p>
          </div>
          <div className={cx("col-6", "col-md-4", "col-lg-3", "d-flex", "align-items-end")}>
            <button className={cx("primary-btn")} onClick={this.establishTheConnection}>Connect</button>
          </div>
        </div>
      </div>
    );
  }
}

export default MewAsset;