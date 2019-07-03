import React, { Component } from 'react';
var { Isoxys } = require('capsule-core-js');

// Setup CSS Module
import classNames from 'classnames/bind';
import style from '../../static/style/index.module.css';
var cx = classNames.bind(style);

const DEFAULT_STATE = {
  privateKey: '',
  error: null,
  loading: false
}


class PrivateKeyAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...DEFAULT_STATE
    }

    this.done = props.done;
  }

  handleChange = (e) => {
    this.setState({ privateKey: e.target.value, error: null });
  }

  handleSubmit = () => {
    this.checkPrivatekey(ok => {
      if (!ok) return this.setState({ error: 'Invalid private key!' });

      this.returnData2Parent();
    });
  }

  checkPrivatekey = (callback) => {
    this.setState({ loading: true }, () => {
      // Fetch the first address to know whether good file
      let isoxys = new Isoxys(window.capsuleWallet.networkId, 'softwallet', true);
      isoxys.getAccountByPrivatekey(this.state.privateKey, (er, re) => {
        this.setState({ loading: false });
        if (er || re.lenght <= 0) return callback(false);
        return callback(true);
      });
    });
  }

  returnData2Parent = () => {
    return this.done({
      model: 'private-key',
      asset: {
        privateKey: this.state.privateKey
      }
    });
  }

  componentWillUnmount() {
    // Clear history
    this.setState({ ...DEFAULT_STATE });
  }

  render() {
    return (
      <div className={cx("wallet-form")}>
        <div className={cx("row", "mb-3")}>
          <div className={cx("col", "d-flex")}>
            <i className={cx("warning")} />
            <p className={cx("warning")}>This is not recommend way to access your wallet.</p>
          </div>
        </div>
        <div className={cx("row", "mb-3")}>
          <div className={cx("col", "d-flex")}>
            <p>Enter private key</p>
          </div>
        </div>
        <div className={cx("row", "mb-3")}>
          <div className={cx("col")}>
            <input type="text" className={cx("input")} placeholder="Private Key" value={this.state.privateKey} onChange={this.handleChange}></input>
          </div>
        </div>
        <div className={cx("row", "mb-3")}>
          <div className={cx("col-6", "col-md-8", "col-lg-9", "d-flex", "align-items-end")}>
            <p className={cx("warning", "text-bottom")}>{this.state.error}</p>
          </div>
          <div className={cx("col-6", "col-md-4", "col-lg-3", "d-flex")}>
            <button className={cx("primary-btn")} onClick={this.handleSubmit}>OK</button>
          </div>
        </div>
      </div>
    );
  }
}

export default PrivateKeyAsset;
