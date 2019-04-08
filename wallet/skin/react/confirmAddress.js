import React, { Component } from 'react';
// import Loading from './core/loading';

var Isoxys = require('../../lib/isoxys');

// Setup CSS Module
// import classNames from 'classnames/bind';
// import style from 'Style/index.scss';
// var cx = classNames.bind(style);

const ERROR = 'No address found';
const DEFAULT_HD_PATH = "m/44'/60'/0'/0";
const LIMIT = 5, PAGE = 0;

const DEFAULT_STATE = {
  addressList: [],
  selectedAddress: null,
  i: 0,
  limit: LIMIT,
  page: PAGE,
  loading: false
}



class ConfirmAddress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      ...DEFAULT_STATE
    }

    this.done = this.props.done;

    this.onClose = this.onClose.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onMore = this.onMore.bind(this);
    this.getAddress = this.getAddress.bind(this);
  }

  /**
   * UI controllers
   */

  onClose(er) {
    this.setState({ visible: false });
    this.done(er, null);
  }

  onConfirm() {
    var self = this;
    this.setState({ visible: false });
    // Confirm Isoxys address
    if (this.props.data.wallet === 'isoxys') {
      this.initIsoxys(this.props.data, this.state.i).then(isoxys => {
        self.done(null, { provider: isoxys });
      }).catch(er => {
        self.done(er, null);
      });
    }
    // Error occurs
    else {
      this.onClose(ERROR);
    }

    // Clear history
    this.setState(DEFAULT_STATE);
  }

  onSelect(index, address) {
    this.setState({
      selectedAddress: address,
      i: index
    });
  }

  onMore() {
    this.setState({ loading: true }, function () {
      var page = this.state.page + 1;
      this.getAddressByIsoxys(this.props.data, this.state.limit, page).then(re => {
        var addressList = this.state.addressList;
        addressList.push(...re);
        this.setState({ page: page, addressList: addressList });
      }).catch(er => {
        if (er) this.onClose(ERROR);
      }).finally(() => {
        return this.setState({ loading: false });
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) this.getAddress(this.props.data);
      this.setState({ visible: this.props.visible });
    }
  }


  /**
   * Data controllers
   */
  getAddress(data) {
    // We don't need to get address in case of metamask
    if (data.wallet === 'isoxys') {
      this.getAddressByIsoxys(data, this.state.limit, this.state.page).then(re => {
        return this.setState({ addressList: re });
      }).catch(er => {
        if (er) return this.onClose(ERROR);
      });
    }
    else {
      return this.onClose(ERROR);
    }
  }

  /**
   * Wallet conventions
   */
  getAddressByIsoxys(data, limit, page) {
    var isoxys = new Isoxys(data.net, data.type, true);
    return new Promise((resolve, reject) => {
      switch (data.subType) {
        // Mnemonic
        case 'mnemonic':
          return isoxys.getAccountsByMnemonic(
            data.asset.mnemonic,
            data.asset.password,
            DEFAULT_HD_PATH,
            limit,
            page,
            function (er, re) {
              if (er || re.length <= 0) return reject(ERROR);
              return resolve(re);
            });
        // Keystore
        case 'keystore':
          return isoxys.getAccountByKeystore(
            data.asset.keystore,
            data.asset.password,
            function (er, re) {
              if (er || !re) return reject(ERROR);
              return resolve([re]);
            });
        // Ledger Nano S
        case 'ledger-nano-s':
          return isoxys.getAccountsByLedger(
            DEFAULT_HD_PATH,
            limit,
            page,
            function (er, re) {
              if (er || re.length <= 0) return reject(ERROR);
              return resolve(re);
            });
        // Private key
        case 'private-key':
          return isoxys.getAccountByPrivatekey(
            data.asset.privateKey,
            function (er, re) {
              if (er || !re) return reject(ERROR);
              return resolve([re]);
            });
        // Error
        default:
          return reject(ERROR);
      }
    });
  }

  initIsoxys(data, i) {
    var isoxys = new Isoxys(data.net, data.type, true);
    return new Promise((resolve, reject) => {
      switch (data.subType) {
        // Mnemonic
        case 'mnemonic':
          return isoxys.setAccountByMnemonic(
            data.asset.mnemonic,
            data.asset.password,
            DEFAULT_HD_PATH,
            i,
            window.capsuleWallet.getPassphrase,
            function (er, re) {
              if (er) return reject(er);
              return resolve(isoxys);
            });
        // Keystore
        case 'keystore':
          return isoxys.setAccountByKeystore(
            data.asset.keystore,
            data.asset.password,
            window.capsuleWallet.getPassphrase,
            function (er, re) {
              if (er) return reject(er);
              return resolve(isoxys);
            });
        // Ledger Nano S
        case 'ledger-nano-s':
          return isoxys.setAccountByLedger(
            DEFAULT_HD_PATH,
            i,
            function (er, re) {
              if (er) return reject(er);
              return resolve(isoxys);
            });
        // Private key
        case 'private-key':
          return isoxys.setAccountByPrivatekey(
            data.asset.privateKey,
            window.capsuleWallet.getPassphrase,
            function (er, re) {
              if (er) return reject(er);
              return resolve(isoxys);
            });
        // Error
        default:
          return reject(ERROR);
      }
    });
  }

  // UI conventions
  showAddresses(defaultIndex, addressList) {
    return addressList.map((address, index) => {
      return (
        <ul key={address} className="col-12 col-lg-6 address-checkbox justify-content-center">
          <li >
            <input
              type="checkbox"
              id={"checkbox-options-" + address}
              value={address}
              onChange={() => this.onSelect(index, address)}
              checked={index === defaultIndex} />
            <label htmlFor={"checkbox-options-" + address}>{address}</label>
          </li>
        </ul>
      );
    });
  }

  render() {
    return (
      <div className="row align-items-center wallet-body">
        <div className="col">
          <div className="box-form">

            <div className="row pt-3 mb-3">
              <div className="col">
                <h2>Choose Your Wallet Address</h2>
              </div>
            </div>

            <div className="row mb-3">
              {this.showAddresses(this.state.i, this.state.addressList)}
            </div>

            <div className="row mb-3">
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 mt-2">
                <div className="row">
                  <div className="col text-center">
                    <button className="small-circle-btn"><i className="previous" /></button>
                  </div>
                  <div className="col text-center">
                    <button className="small-circle-btn" onClick={this.onMore}>2</button>
                  </div>
                  <div className="col text-center">
                    <button className="small-circle-btn"><i className="next" /></button>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 mt-2 ml-auto">
                <div className="row">
                  <div className="col text-center">
                    <button className="primary-btn" onClick={this.onConfirm}>OK</button>
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