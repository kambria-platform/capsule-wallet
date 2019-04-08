import React, { Component } from 'react';
import Loading from './core/loading';
var Isoxys = require('../../lib/isoxys');

// Setup CSS Module
// import classNames from 'classnames/bind';
// import style from 'Style/index.scss';
// var cx = classNames.bind(style);

const STATUS = {
  INIT: 'Please connect the devide and click the button!',
  TEST: 'Connecting',
  FAIL: 'Cannot connect the devide!'
}


class LedgerNanoSAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: STATUS.INIT
    }

    this.checkTheConnection = this.checkTheConnection.bind(this);
    this.returnData2Parent = this.returnData2Parent.bind(this);
  }

  checkTheConnection() {
    var self = this;
    this.setState({ message: STATUS.TEST });
    // Fetch the first address to know whether devide connected
    var isoxys = new Isoxys(null /** Use default for testing */, 'hardWallet', true);
    isoxys.getAccountsByLedger("m/44'/60'/0'", 1, 0, function (er, re) {
      if (er || re.lenght <= 0) return self.setState({ message: STATUS.FAIL });

      return self.returnData2Parent();
    });
  }

  returnData2Parent() {
    this.props.done({
      subType: 'ledger-nano-s'
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
          <div className="col d-flex">
            {this.state.message === STATUS.TEST ? <Loading /> : null}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-8 col-lg-9 d-flex align-items-end">
            <p className="text-bottom">{this.state.message}</p>
          </div>
          <div className="col-4 col-lg-3 d-flex">
            <button className="primary-btn" onClick={this.checkTheConnection}>Connect</button>
          </div>
        </div>
      </div>
    )
  }
}

export default LedgerNanoSAsset;