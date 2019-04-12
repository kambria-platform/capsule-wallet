import React, { Component } from 'react';

var Metamask = require('../../../lib/metamask');

// Setup CSS Module
// import classNames from 'classnames/bind';
// import style from 'Style/index.scss';
// var cx = classNames.bind(style);


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
    this.onIsoxys = this.onIsoxys.bind(this);
    this.onMew = this.onMew.bind(this);
  }

  onClose() {
    this.setState({ visible: false });
    this.done(null, null);
  }

  onMetamask(type) {
    this.setState({ visible: false });
    var self = this;
    var metamask = new Metamask(this.data.net, type, true);
    metamask.setAccountByMetamask(function (er, re) {
      if (er) return self.done(er, null);

      self.done(null, {
        wallet: 'metamask',
        type: type,
        provider: metamask
      });
    });
  }

  onIsoxys(type) {
    this.setState({ visible: false });
    this.done(null, { wallet: 'isoxys', type: type });
  }

  onMew(type) {
    this.setState({ visible: false });
    this.done(null, { wallet: 'mew', type: type });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({ visible: this.props.visible });
    }
  }

  render() {
    return (
      <div className="row align-items-center wallet-body animated fadeInUp">
        < div className="row w-100">
          <div className="col-6 col-sm-3 col-lg">
            <div className="box active" onClick={() => this.onMetamask('softwallet')}>
              <i className="metamask" />
              <p>Metamask</p>
            </div>
          </div>
          <div className="col-6 col-sm-3 col-lg">
            <div className="box active" onClick={() => this.onIsoxys('hardwallet')}>
              <i className="hardwallet" />
              <p>Hardwallet</p>
            </div>
          </div>
          <div className="col-6 col-sm-3 col-lg">
            <div className="box active" onClick={() => this.onMew('hybridwallet')}>
              <i className="mew" />
              <p>MEW</p>
            </div>
          </div>
          <div className="col-6 col-sm-3 col-lg">
            <div className="box negative" onClick={() => this.onIsoxys('softwallet')}>
              <i className="softwallet" />
              <p>Softwallet</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SellectWallet;