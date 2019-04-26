import React, { Component } from 'react';
var Trezor = require('../../../lib/trezor');

// Setup CSS Module
import classNames from 'classnames/bind';
import style from 'Style/index.scss';
var cx = classNames.bind(style);

const STATUS = {
  INIT: 'Please connect the devide and click the button!',
  TEST: 'Connecting',
  FAIL: 'Cannot connect the devide!'
}


class TrezorAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: STATUS.INIT
    }

    this.checkTheConnection = this.checkTheConnection.bind(this);
  }

  checkTheConnection() {
    var self = this;
    this.setState({ message: STATUS.TEST, loading: true }, () => {
      // Fetch the first address to know whether devide connected
      var trezor = new Trezor(null /** Use default for testing */, 'hardwallet', true);
      trezor.getAccountsByTrezorOne("m/44'/60'/0'/0", 1, 0, function (er, re) {
        if (er || re.length < 0) return self.setState({ message: STATUS.FAIL, loading: false });
        return self.props.done({ wallet: 'trezor', subType: 'trezor-one' });
      });
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
            <button className={cx("primary-btn")} onClick={this.checkTheConnection}>Connect</button>
          </div>
        </div>
      </div>
    )
  }
}

export default TrezorAsset;