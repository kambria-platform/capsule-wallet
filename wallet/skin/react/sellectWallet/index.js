import React, { Component } from 'react';

var Metamask = require('../../../lib/metamask');

// Setup CSS Module
import classNames from 'classnames/bind';
import style from 'Style/index.scss';
var cx = classNames.bind(style);


class SellectWallet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible
    }

    this.data = this.props.data;
    this.done = this.props.done;

    this.onClose = this.onClose.bind(this);
    this.onMetamask = this.onMetamask.bind(this);
    this.onLedger = this.onLedger.bind(this);
    this.onIsoxys = this.onIsoxys.bind(this);
    this.onMew = this.onMew.bind(this);
  }

  onClose() {
    this.setState({ visible: false });
    this.done(null, null);
  }

  onMetamask() {
    this.setState({ visible: false });
    var self = this;
    let type = 'softwallet';
    let wallet = 'metamask';
    var metamask = new Metamask(window.capsuleWallet.net, type, true);
    metamask.setAccountByMetamask(function (er, re) {
      if (er) return self.done(er, null);

      self.done(null, {
        wallet: wallet,
        type: type,
        provider: metamask
      });
    });
  }

  onLedger() {
    this.setState({ visible: false });
    let type = 'hardwallet';
    let wallet = 'ledger';
    this.done(null, { wallet: wallet, type: type });
  }

  onIsoxys() {
    this.setState({ visible: false });
    let type = 'softwallet';
    let wallet = 'isoxys';
    this.done(null, { wallet: wallet, type: type });
  }

  onMew() {
    this.setState({ visible: false });
    let type = 'hybridwallet';
    let wallet = 'mew';
    this.done(null, { wallet: wallet, type: type });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({ visible: this.props.visible });
    }
  }

  render() {
    return (
      <div className={cx("row", "align-items-center", "wallet-body", "animated", "fadeInUp")}>
        < div className={cx("row", "w-100")}>
          <div className={cx("col-6", "col-sm-3", "col-lg")}>
            <div className={cx("box", "active")} onClick={this.onMetamask}>
              <i className={cx("metamask")} />
              <p>Metamask</p>
            </div>
          </div>
          <div className={cx("col-6", "col-sm-3", "col-lg")}>
            <div className={cx("box", "active")} onClick={this.onLedger}>
              <i className={cx("hardwallet")} />
              <p>Hardwallet</p>
            </div>
          </div>
          <div className={cx("col-6", "col-sm-3", "col-lg")}>
            <div className={cx("box", "active")} onClick={this.onMew}>
              <i className={cx("mew")} />
              <p>MEW</p>
            </div>
          </div>
          <div className={cx("col-6", "col-sm-3", "col-lg")}>
            <div className={cx("box", "negative")} onClick={this.onIsoxys}>
              <i className={cx("softwallet")} />
              <p>Softwallet</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SellectWallet;