import React, { Component } from 'react';

var Metamask = require('../../../lib/metamask');

// Setup CSS Module
import classNames from 'classnames/bind';
import style from '../../static/style/index.module.css';
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
    this.onHardwallet = this.onHardwallet.bind(this);
    this.onSoftwallet = this.onSoftwallet.bind(this);
    this.onHybridwallet = this.onHybridwallet.bind(this);
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

  onHardwallet() {
    this.setState({ visible: false });
    let type = 'hardwallet';
    let wallet = 'ledger';
    this.done(null, { wallet: wallet, type: type });
  }

  onHybridwallet() {
    this.setState({ visible: false });
    let type = 'hybridwallet';
    let wallet = 'mew';
    this.done(null, { wallet: wallet, type: type });
  }

  onSoftwallet() {
    this.setState({ visible: false });
    let type = 'softwallet';
    let wallet = 'isoxys';
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
            <div className={cx("box", "active")} onClick={this.onHardwallet}>
              <i className={cx("hardwallet")} />
              <p>Hardwallet</p>
            </div>
          </div>
          <div className={cx("col-6", "col-sm-3", "col-lg")}>
            <div className={cx("box", "active")} onClick={this.onHybridwallet}>
              <i className={cx("hybridwallet")} />
              <p>Hybridwallet</p>
            </div>
          </div>
          <div className={cx("col-6", "col-sm-3", "col-lg")}>
            <div className={cx("box", "negative")} onClick={this.onSoftwallet}>
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