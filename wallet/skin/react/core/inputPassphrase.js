import React, { Component } from 'react';
import Modal from './modal';
import Header from './header';
import Author from './author';

// Setup CSS Module
import classNames from 'classnames/bind';
import style from 'Style/index.scss';
var cx = classNames.bind(style);

const DEFAULT_STATE = {
  passphrase: ''
}
const ERROR = 'Used denied to enter passpharse';


class InputPassphrase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      ...DEFAULT_STATE
    }

    this.done = this.props.done;

    this.onClose = this.onClose.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onClose() {
    this.setState({ visible: false });
    this.done(ERROR, null);

    // Clear history
    this.setState(DEFAULT_STATE);
  }

  handleSubmit() {
    this.setState({ visible: false });
    if (!this.state.passphrase) this.done(ERROR, null);
    else this.done(null, this.state.passphrase);

    // Clear history
    this.setState(DEFAULT_STATE);
  }

  onChange(e) {
    this.setState({ passphrase: e.target.value });
  }

  componentDidMount() {
    // Listen Enter button
    let input = document.getElementById('inputPassphrase');
    if (input) input.addEventListener('keyup', e => {
      if (e.keyCode === 13) this.handleSubmit();
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({
        visible: this.props.visible,
        ...DEFAULT_STATE
      }, () => {
        // Autofocus
        setTimeout(() => {
          if (this.passpharseName) this.passpharseName.focus();
        }, 1);
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
                      <h2>Input Your Passphrase</h2>
                    </div>
                  </div>
                  <div className={cx("wallet-form")}>
                    <div className={cx("row mb-3")}>
                      <div className={cx("col", "d-flex")}>
                        <p>Passphrase</p>
                      </div>
                    </div>
                    <div className={cx("row", "mb-3")}>
                      <div className={cx("col-8", "col-lg-9")}>
                        <input id="inputPassphrase" type="password" className={cx("input")} placeholder="Temporary Passphrase"
                          value={this.state.passphrase}
                          onChange={this.onChange}
                          ref={(name) => { this.passpharseName = name; }}></input>
                      </div>
                      <div className={cx("col-4 col-lg-3")}>
                        <button className={cx("primary-btn")} onClick={this.handleSubmit}>OK</button>
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

export default InputPassphrase;