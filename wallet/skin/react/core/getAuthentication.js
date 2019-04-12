import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import Modal from './modal';
import Header from './header';
import Author from './author';

// Setup CSS Module
// import classNames from 'classnames/bind';
// import style from 'Style/index.scss';
// var cx = classNames.bind(style);

const ERROR = 'Used denied to autheticate';


class getAuthentication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      qrcode: this.props.qrcode
    }

    this.done = this.props.done;

    this.onClose = this.onClose.bind(this);
  }

  onClose() {
    this.setState({ visible: false, qrcode: null });
    this.done(ERROR, null);
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({
        visible: this.props.visible,
        qrcode: this.props.qrcode,
      });
    }
  }

  render() {
    return (
      <Modal visible={this.state.visible} className="animated slideInUp" >
        <div className="modal-body wallet">
          <div className="row justify-content-end">
            <button className="close-btn" onClick={() => { this.onClose() }} />
          </div>
          <div className="container">
            <Header />
            <div className="row align-items-center wallet-body">
              <div className="col">
                <div className="box-form">
                  <div className="row pt-3 mb-3">
                    <div className="col">
                      <h2>Authetication</h2>
                    </div>
                  </div>
                  <div className="wallet-form">
                    <div className="row mb-3">
                      <div className="col-8 col-lg-9 d-flex align-items-end">
                        <p className="text-left">Please using MyEtherWallet application on your phone to scan and establish the connection!</p>
                      </div>
                      <div className="col-4 col-lg-3 d-flex">
                        {this.state.qrcode ? <QRCode value={this.state.qrcode} /> : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Author />
      </Modal>
    );
  }
}

export default getAuthentication;