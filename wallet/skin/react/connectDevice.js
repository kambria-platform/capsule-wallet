import React, { Component } from 'react';
import LedgerNanoSAsset from './ledgerNanoS.connectDevice';
import TrezorAsset from './trezor.connectDevice';

// Setup CSS Module
// import classNames from 'classnames/bind';
// import style from 'Style/index.scss';
// var cx = classNames.bind(style);

const MENU = [
  { key: 'ledger-nano-s', label: '', icon: 'ledger', status: 'active' },
  { key: 'trezor', label: '(comming soon)', icon: 'trezor', status: 'active' },
];


class ConnectDevice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subType: 'ledger-nano-s'
    }

    this.data = this.props.data;

    this.onSelect = this.onSelect.bind(this);
    this.onConnect = this.onConnect.bind(this);
    this.menu = this.menu.bind(this);
    this.device = this.device.bind(this);
  }

  onClose() {
    this.setState({ visible: false });
    this.props.done(null, null);
  }

  onSelect(subType) {
    this.setState({ subType: subType });
  }

  onConnect(data) {
    this.props.done(null, data);
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({ visible: this.props.visible });
    }
  }

  menu() {
    return MENU.map(item => {
      return (
        <div key={item.key}
          className={"col col-md-2 wallet-nav " + item.status + (item.key === this.state.subType ? ' selected' : '')}
          onClick={() => this.onSelect(item.key)}>
          <i className={item.icon} />
        </div>)
    });
  }

  device() {
    if (this.state.subType === 'ledger-nano-s') return <LedgerNanoSAsset done={this.onConnect} />
    if (this.state.subType === 'trezor') return <TrezorAsset done={this.onConnect} />
  }

  render() {
    return (
      <div className="row align-items-center wallet-body">
        <div className="col">
          <div className="box-form">
            <div className="row wallet-tab">
              {this.menu()}
            </div>

            <div className="wallet-form">
              {this.device()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ConnectDevice;