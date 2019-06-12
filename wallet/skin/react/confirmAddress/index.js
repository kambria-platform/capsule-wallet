import React, { Component } from 'react';
import ConfirmAddressHelper from './helper';

// Setup CSS Module
import classNames from 'classnames/bind';
import style from '../../static/style/index.module.css';
var cx = classNames.bind(style);

const ERROR = 'No address found';
const LIMIT = 5, PAGE = 0;
const DEFAULT_HD_PATH = "m/44'/60'/0'/0";

const DEFAULT_STATE = {
  addressList: [],
  i: 0,
  limit: LIMIT,
  page: PAGE,
  loading: false
}


class ConfirmAddress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...DEFAULT_STATE
    }

    this.done = this.props.done;

    this.getAddress = this.getAddress.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onPage = this.onPage.bind(this);
  }

  getAddress(data, limit, page, callback) {
    if (data.wallet === 'isoxys') {
      this.setState({ loading: true }, function () {
        ConfirmAddressHelper.getAddressByIsoxys(data, DEFAULT_HD_PATH, limit, page).then(re => {
          return callback(null, re);
        }).catch(er => {
          if (er) return callback(ERROR, null);
        });
      });
    }
    else if (data.wallet === 'ledger') {
      this.setState({ loading: true }, function () {
        ConfirmAddressHelper.getAddressByLedger(data, DEFAULT_HD_PATH, limit, page).then(re => {
          return callback(null, re);
        }).catch(er => {
          if (er) return callback(ERROR, null);
        });
      });
    }
    else if (data.wallet === 'trezor') {
      this.setState({ loading: true }, function () {
        ConfirmAddressHelper.getAddressByTrezor(data, DEFAULT_HD_PATH, limit, page).then(re => {
          return callback(null, re);
        }).catch(er => {
          if (er) return callback(ERROR, null);
        });
      });
    }
    else {
      return callback(ERROR, null);
    }
  }

  /**
   * UI controllers
   */

  onClose(er) {
    return this.done(er, null);
  }

  onConfirm() {
    let index = this.state.i + this.state.limit * this.state.page;
    this.done(null, { dpath: DEFAULT_HD_PATH, index: index });
    this.setState(DEFAULT_STATE);
  }

  onSelect(index) {
    this.setState({ i: index });
  }

  onPage(step) {
    let page = this.state.page + step;
    if (page < 0) page = 0;
    if (page == this.state.page) return;

    let self = this;
    this.getAddress(this.props.data, this.state.limit, page, function (er, re) {
      if (er) return self.onClose(ERROR);

      return self.setState({ loading: false, page: page, addressList: re });
    });
  }

  componentDidMount() {
    let self = this;
    this.getAddress(this.props.data, this.state.limit, this.state.page, function (er, re) {
      if (er) return self.onClose(ERROR);

      return self.setState({ loading: false, addressList: re });
    });
  }

  // UI conventions
  showAddresses(defaultIndex, addressList) {
    return addressList.map((address, index) => {
      return (
        <ul key={address} className={cx("col-12", "col-lg-6", "address-checkbox", "justify-content-center", "animated", "fadeInUp")}>
          <li >
            <input
              type="checkbox"
              id={"checkbox-options-" + address}
              value={address}
              onChange={() => this.onSelect(index)}
              checked={index === defaultIndex} />
            <label htmlFor={"checkbox-options-" + address}>{address}</label>
          </li>
        </ul>
      );
    });
  }

  render() {
    return (
      <div className={cx("row", "align-items-center", "wallet-body", "animated", "zoomIn")}>
        <div className={cx("col")}>
          <div className={cx("box-form", { "loading": this.state.loading })}>

            <div className={cx("row", "pt-3", "mb-3")}>
              <div className={cx("col")}>
                <h2>Choose Your Wallet Address {this.state.loading}</h2>
              </div>
            </div>

            <div className={cx("row", "mb-3")}>
              {this.showAddresses(this.state.i, this.state.addressList)}

              <div className={cx("col")}>
                <div className={cx("row", "h-100")}>
                  <div className={cx("col-4", "col-sm-2", "d-flex", "justify-content-center", "align-items-center", "mt-2", "mb-2")}>
                    <button className={cx("small-circle-btn")} onClick={() => { this.onPage(-1) }}><i className={cx("previous")} /></button>
                  </div>
                  <div className={cx("col-4", "col-sm-2", "d-flex", "justify-content-center", "align-items-center", "mt-2", "mb-2")}>
                    <button className={cx("small-circle-btn")}>{this.state.page + 1}</button>
                  </div>
                  <div className={cx("col-4", "col-sm-2", "d-flex", "justify-content-center", "align-items-center", "mt-2", "mb-2")}>
                    <button className={cx("small-circle-btn")} onClick={() => { this.onPage(1) }}><i className={cx("next")} /></button>
                  </div>
                  <div className={cx("col-12", "col-sm-6", "d-flex", "justify-content-center", "align-items-center", "mt-2", "mb-2")}>
                    <button className={cx("primary-btn")} onClick={this.onConfirm}>OK</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmAddress;