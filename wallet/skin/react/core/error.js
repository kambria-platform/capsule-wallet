import React, { Component } from 'react';
import Modal from './modal';
import { Button } from './buttons';

// Setup CSS Module
import classNames from 'classnames/bind';
import style from 'Style/index.scss';
var cx = classNames.bind(style);

const DEFAULT_STATE = {
  error: ''
}


class ErrorModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      ...DEFAULT_STATE
    }

    this.onClose = this.onClose.bind(this);
  }

  onClose() {
    this.setState({ visible: false });
    this.props.done();

    // Clear history
    this.setState(DEFAULT_STATE);
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({ visible: this.props.visible });
    }
    if (this.props.error !== prevProps.error) {
      this.setState({ error: this.props.error });
    }
  }

  render() {
    return (
      <Modal className={cx("wallet-modal", "error-modal")}
        visible={this.state.visible}
        onClickBackdrop={this.onClose}
        dialogClassName={cx("modal-dialog-centered")}>

        <div className={cx("modal-body")}>
          <button type="button" className={cx("close-button")} onClick={this.onClose} />
          <span className={cx("title", "d-block", "text-center", "mt-4")} style={{ "color": "#D0021B", "fontSize": "24px" }}>Error!</span>
          <p className={cx("d-block", "text-center", "mb-4")} style={{ "color": "#282F38", "fontSize": "16px", "lineHeight": "18px", "width": "380px", "margin": "auto" }}>We have problem reading your wallet address. Please try again.</p>
          <p className={cx("d-block", "text-center", "mb-4")} style={{ "color": "#282F38", "fontSize": "10px", "lineHeight": "18px", "width": "380px", "margin": "auto" }}>Detail: {this.state.error}</p>
          <Button
            type="primary"
            size="sm"
            customStyle={{ "display": "block", "margin": "24px auto 12px", "width": "210px" }}
            onClick={this.onClose}
          >OK</Button>
        </div>

      </Modal>
    );
  }
}

export default ErrorModal;