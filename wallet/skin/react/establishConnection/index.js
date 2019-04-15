import React, { Component } from 'react';
import MewAsset from './mew';

// Setup CSS Module
import classNames from 'classnames/bind';
import style from 'Style/index.scss';
var cx = classNames.bind(style);

const MENU = [
  { key: 'mew', label: 'MEW', icon: 'mew-solid', status: 'active', css: '' },
  { key: 'back', label: 'Back', icon: 'arrow-left', status: 'standard', css: 'ml-auto' },
];


class EstablishConnection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subType: 'mew'
    }

    this.onSelect = this.onSelect.bind(this);
    this.onConnect = this.onConnect.bind(this);
    this.menu = this.menu.bind(this);
    this.device = this.device.bind(this);
  }

  onSelect(key) {
    if (key === 'back') return window.capsuleWallet.back();
    return this.setState({ subType: key });
  }

  onConnect(data) {
    this.props.done(null, data);
  }

  menu() {
    return MENU.map(item => {
      return (
        <div key={item.key}
          className={cx("col", "col-md-2", "wallet-nav", item.status, { "selected": item.key === this.state.subType }, item.css)}
          onClick={() => this.onSelect(item.key)}>
          <div className={cx("d-flex", "h-100", "justify-content-center", "align-items-center")}>
            <i className={cx(item.icon)} />
            <p>{item.label}</p>
          </div>
        </div>
      );
    });
  }

  device() {
    if (this.state.subType === 'mew') return <MewAsset done={this.onConnect} />
  }

  render() {
    return (
      <div className={cx("row", "align-items-center", "wallet-body", "animated", "zoomIn")}>
        <div className={cx("col")}>
          <div className={cx("box-form")}>
            <div className={cx("row", "wallet-tab")}>
              {this.menu()}
            </div>
            {this.device()}
          </div>
        </div>
      </div>
    )
  }
}

export default EstablishConnection;