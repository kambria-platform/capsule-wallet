import React, { Component } from 'react';
var Isoxys = require('../../../lib/isoxys');

// Setup CSS Module
// import classNames from 'classnames/bind';
// import style from 'Style/index.scss';
// var cx = classNames.bind(style);

const STATUS = {
  INIT: 'Please connecting your wallet and click the button!',
  TEST: 'Waiting for the connection',
  FAIL: 'Cannot connect your wallet!'
}


class LedgerNanoSAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: STATUS.INIT,
      loading: false
    }

    this.checkTheConnection = this.checkTheConnection.bind(this);
  }

  checkTheConnection() {
    var self = this;
    this.setState({ message: STATUS.TEST, loading: true }, () => {
      // Fetch the first address to know whether devide connected
      var isoxys = new Isoxys(null /** Use default for testing */, 'hardWallet', true);
      isoxys.getAccountsByLedger("m/44'/60'/0'", 1, 0, function (er, re) {
        if (er || re.lenght <= 0) return self.setState({ message: STATUS.FAIL, loading: false });
        return self.props.done({ subType: 'ledger-nano-s' });
      });
    });
  }

  render() {
    return (
      <div className={"wallet-form" + (this.state.loading ? " loading" : "")}>
        <div className="row mb-3">
          <div className="col d-flex">
            <i className="checked" />
            <p className="checked">This is a recommend way to access your wallet.</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-8 col-lg-9 d-flex align-items-end">
            <p className={"text-left" + (this.state.message === STATUS.FAIL ? " warning" : "")}>{this.state.message}</p>
          </div>
          <div className="col-4 col-lg-3 d-flex">
            <button className="primary-btn" onClick={this.checkTheConnection}>Go</button>
          </div>
        </div>
      </div>
    )
  }
}

export default LedgerNanoSAsset;