import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import Modal from './modal';
import Header from './header';
import Author from './author';

// Setup CSS Module
import classNames from 'classnames/bind';
import style from '../../static/style/index.module.css';
var cx = classNames.bind(style);

const ERROR = 'User denied to autheticate';


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
      <Modal visible={this.state.visible} className={cx("animated", "slideInUp")} >
        <div className={cx("modal-body", "wallet")}>
          <div className={cx("row", "justify-content-end")}>
            <button className={cx("close-btn")} onClick={() => { this.onClose() }} />
          </div>
          <div className={cx("container")}>
            <Header />
            <div className={cx("row", "align-items-center", "wallet-body")}>
              <div className={cx("col")}>
                <div className={cx("box-form")}>
                  <div className={cx("row", "pt-3", "mb-3")}>
                    <div className={cx("col")}>
                      <h2>Authetication</h2>
                    </div>
                  </div>
                  <div className={cx("wallet-form")}>
                    <div className={cx("row")}>
                      <div className={cx("col-12", "col-md-8", "d-flex", "align-items-end", "mb-3")}>
                        <p className={cx("text-left")}>Please using MyEtherWallet application on your phone to scan and establish the connection!</p>
                      </div>
                      <div className={cx("col-12", "col-md-4", "mb-3")}>
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