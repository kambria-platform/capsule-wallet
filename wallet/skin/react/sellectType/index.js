import React, { Component } from 'react';

// Setup CSS Module
import classNames from 'classnames/bind';
import style from '../../static/style/index.module.css';
var cx = classNames.bind(style);


class SellectType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible
    }

    this.done = props.done;
  }

  onClose = () => {
    this.setState({ visible: false });
    this.done(null, null);
  }

  onMetamask = () => {
    this.setState({ visible: false });
    this.done(null, {
      type: 'softwallet',
      wallet: 'metamask',
      model: 'metamask'
    });
  }

  onHardwallet = () => {
    this.setState({ visible: false });
    this.done(null, {
      type: 'hardwallet'
    });
  }

  onHybridwallet = () => {
    this.setState({ visible: false });
    this.done(null, {
      type: 'hybridwallet'
    });
  }

  onSoftwallet = () => {
    this.setState({ visible: false });
    this.done(null, {
      type: 'softwallet',
      wallet: 'isoxys'
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({ visible: this.props.visible });
    }
  }

  render() {
    return (
      <div className={cx("row", "align-items-center", "wallet-body", "animated", "fadeInUp")}>
        < div className={cx("row", "w-100")}>
          <div className={cx("col-6", "col-sm-3", "col-lg")}>
            <div className={cx("box", "active")} onClick={this.onMetamask}>
              <i className={cx("metamask")} />
              <p>Metamask</p>
            </div>
          </div>
          <div className={cx("col-6", "col-sm-3", "col-lg")}>
            <div className={cx("box", "active")} onClick={this.onHardwallet}>
              <i className={cx("hardwallet")} />
              <p>Hardwallet</p>
            </div>
          </div>
          <div className={cx("col-6", "col-sm-3", "col-lg")}>
            <div className={cx("box", "active")} onClick={this.onHybridwallet}>
              <i className={cx("hybridwallet")} />
              <p>Hybridwallet</p>
            </div>
          </div>
          <div className={cx("col-6", "col-sm-3", "col-lg")}>
            <div className={cx("box", "negative")} onClick={this.onSoftwallet}>
              <i className={cx("softwallet")} />
              <p>Softwallet</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SellectType;