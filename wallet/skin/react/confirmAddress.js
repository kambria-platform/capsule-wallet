import React, { Component } from 'react';
import ConfirmAddressHelper from './confirmAddress.helper';
// import Loading from './core/loading';

// Setup CSS Module
// import classNames from 'classnames/bind';
// import style from 'Style/index.scss';
// var cx = classNames.bind(style);

const ERROR = 'No address found';
const LIMIT = 5, PAGE = 0;

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

    this.onClose = this.onClose.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onPage = this.onPage.bind(this);
  }

  /**
   * UI controllers
   */

  onClose(er) {
    this.done(er, null);
  }

  onConfirm() {
    var self = this;
    if (this.props.data.wallet === 'isoxys') {
      ConfirmAddressHelper.setAddressByIsoxys(this.props.data, this.state.i + this.state.limit * this.state.page).then(isoxys => {
        self.done(null, { provider: isoxys });
      }).catch(er => {
        self.done(er, null);
      });
    }
    else {
      this.onClose(ERROR);
    }

    this.setState(DEFAULT_STATE);
  }

  onSelect(index) {
    this.setState({ i: index });
  }

  onPage(step) {
    var page = this.state.page + step;
    if (page < 0) page = 0;
    if (page == this.state.page) return;

    this.setState({ loading: true }, function () {
      ConfirmAddressHelper.getAddressByIsoxys(this.props.data, this.state.limit, page).then(re => {
        this.setState({ page: page, addressList: re });
      }).catch(er => {
        if (er) this.onClose(ERROR);
      }).finally(() => {
        return this.setState({ loading: false });
      });
    });
  }

  componentDidMount() {
    let data = this.props.data
    if (data.wallet === 'isoxys') {
      ConfirmAddressHelper.getAddressByIsoxys(data, this.state.limit, this.state.page).then(re => {
        return this.setState({ addressList: re });
      }).catch(er => {
        if (er) return this.onClose(ERROR);
      });
    }
    else {
      return this.onClose(ERROR);
    }
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
      <div className="row align-items-center wallet-body animated zoomIn">
        <div className="col">
          <div className="box-form">

            <div className="row pt-3 mb-3">
              <div className="col">
                <h2>Choose Your Wallet Address</h2>
              </div>
            </div>

            <div className="row mb-3">
              {this.showAddresses(this.state.i, this.state.addressList)}

              <div className="col-12 col-lg-6">
                <div className="row h-100">
                  <div className="col-4 col-sm-2 d-flex justify-content-center align-items-center mt-2 mb-2">
                    <button className="small-circle-btn" onClick={() => { this.onPage(-1) }}><i className="previous" /></button>
                  </div>
                  <div className="col-4 col-sm-2 d-flex justify-content-center align-items-center mt-2 mb-2">
                    <button className="small-circle-btn">{this.state.page + 1}</button>
                  </div>
                  <div className="col-4 col-sm-2 d-flex justify-content-center align-items-center mt-2 mb-2">
                    <button className="small-circle-btn" onClick={() => { this.onPage(1) }}><i className="next" /></button>
                  </div>
                  <div className="col-12 col-sm-6 d-flex justify-content-center align-items-center mt-2 mb-2">
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