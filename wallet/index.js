import React, { Component } from 'react';

// Heros to operate and protect Capsule Bridge
import FiniteStateMachine from './board/finiteStateMachine';
import Web3Factory from './board/web3Factory';

// Setup CSS Module
import classNames from 'classnames/bind';
import style from './skin/static/style/index.module.css';
var cx = classNames.bind(style);

// Global/Inherit components
import Modal from './skin/react/core/modal';
import Header from './skin/react/core/header';
import InputPassphrase from './skin/react/core/inputPassphrase';
import GetAuthentication from './skin/react/core/getAuthentication';
import ErrorForm from './skin/react/core/error';
import Author from './skin/react/core/author';
import Footer from './skin/react/core/footer';

// Workflow components
import SellectType from './skin/react/sellectType';
import InputAsset from './skin/react/inputAsset';
import EstablishConnection from './skin/react/establishConnection';
import ConnectDevice from './skin/react/connectDevice';
import ConfirmAddress from './skin/react/confirmAddress';

// Constants
const ERROR = 'Wallet was broken';
const DEFAULT_STATE = {
  visible: false,
  step: 'Idle',
  error: '',
  passphrase: false,
  authetication: false,
  qrcode: null,
}
const DEFAULT_OPT = {
  networkId: 1,
  restrictedNetwork: true,
  pageRefreshing: true
}


class CapsuleWallet extends Component {

  /**
   * @props net - Network id
   * @props visible - Boolean
   * @props done - Callback function
   */
  constructor(props) {
    super(props);

    this.state = {
      ...DEFAULT_STATE,
      step: props.visible ? this.FSM.next().step : 'Idle'
    };

    this.done = props.done;
    this.options = { ...DEFAULT_OPT, ...props.options }
    this.FSM = new FiniteStateMachine();
    this.W3F = new Web3Factory(this.options.restrictedNetwork, this.options.pageRefreshing);

    /**
     * Group of global functions
     */
    window.capsuleWallet = { author: 'Tu Phan', git: 'https://github.com/kambria-platform/capsule-wallet' }
    window.capsuleWallet.networkId = this.options.networkId; // mainnet as default;
    window.capsuleWallet.getPassphrase = {
      open: (callback) => {
        this.setState({ passphrase: false, returnPassphrase: null }, () => {
          this.setState({ passphrase: true, returnPassphrase: callback });
        });
      },
      close: () => {
        this.setState({ passphrase: false, returnPassphrase: null });
      },
    }
    window.capsuleWallet.getAuthentication = {
      open: (qrcode, callback) => {
        this.setState({ authetication: false, qrcode: null }, () => {
          this.setState({ authetication: true, qrcode: qrcode, returnAuthetication: callback });
        });
      },
      close: () => {
        this.setState({ authetication: false, qrcode: null, returnAuthetication: null });
      },
    }
    window.capsuleWallet.term = () => {
      window.open('https://github.com/kambria-platform/capsule-wallet/blob/master/LICENSE', '_blank');
    }
    window.capsuleWallet.support = () => {
      window.open('https://github.com/kambria-platform/capsule-wallet/issues', '_blank');
    }
    window.capsuleWallet.back = () => {
      let state = this.FSM.back();
      return this.setState({ step: state.step });
    }
    window.capsuleWallet.isConnected = false;
    window.capsuleWallet.logout = () => {
      this.W3F.clearSession(true);
      window.capsuleWallet.isConnected = false;
      window.capsuleWallet.provider = null;
    }
  }

  componentDidMount() {
    // Reconnect to wallet if still maintaining
    this.W3F.isSessionMaintained(session => {
      if (session) this.W3F.regenerate(session, (er, provider) => {
        if (er) return;
        window.capsuleWallet.isConnected = true;
        window.capsuleWallet.provider = provider;
        return this.done(null, provider);
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) return this.setState({ visible: true, step: this.FSM.next().step });
      return this.setState({ ...DEFAULT_STATE });
    }
  }

  /**
   * Flow management
   */

  onData = (er, re) => {
    // User meets error in processing
    if (er) return this.onError(er);

    // Heros are working :)
    // Move to next step
    let state = this.FSM.next(re);

    // Run to next step
    // Error case
    if (state.step === 'Error') return this.onError(ERROR);
    // Success case
    if (state.step === 'Success') return this.onClose(() => {
      this.W3F.generate(state, (er, provider) => {
        if (er) return this.onError(er);
        window.capsuleWallet.isConnected = true;
        window.capsuleWallet.provider = provider;
        return this.done(null, provider);
      });
    });
    // Still in processing
    return this.setState({ step: state.step });
  }

  onError = (er) => {
    return this.setState({ visible: true, error: er, step: 'Error' }, () => {
      this.FSM.reset();
    });
  }

  onClose = (callback) => {
    this.setState({ visible: true }, () => {
      this.setState({ visible: false }, () => {
        this.setState({ ...DEFAULT_STATE }, () => {
          this.FSM.reset();
        });
        if (callback) callback();
      });
    });
  }

  render() {
    return (
      <div className={cx("typography")}>
        <Modal visible={this.state.visible} className={cx("animated", "slideInUp")} >
          <div className={cx("modal-body", "wallet")}>
            <div className={cx("row", "justify-content-end")}>
              <button className={cx("close-btn")} onClick={() => this.onClose(this.done)} />
            </div>
            <div className={cx("container")}>
              <Header />
              {this.state.step === 'SelectWallet' ? <SellectType data={this.FSM.data} done={this.onData} /> : null}
              {this.state.step === 'InputAsset' ? <InputAsset data={this.FSM.data} done={this.onData} /> : null}
              {this.state.step === 'EstablishConnection' ? <EstablishConnection data={this.FSM.data} done={this.onData} /> : null}
              {this.state.step === 'ConnectDevice' ? <ConnectDevice data={this.FSM.data} done={this.onData} /> : null}
              {this.state.step === 'ConfirmAddress' ? <ConfirmAddress data={this.FSM.data} done={this.onData} /> : null}
              {this.state.step === 'Error' ? <ErrorForm error={this.state.error} done={() => this.onClose(() => { this.done(this.state.error, null) })} /> : null}
              <Footer skip={() => this.onClose(this.done)} />
            </div>
          </div>
          <Author />
        </Modal>

        <InputPassphrase visible={this.state.passphrase} done={(er, re) => this.state.returnPassphrase(er, re)} />
        <GetAuthentication visible={this.state.authetication} qrcode={this.state.qrcode} done={(er, re) => this.state.returnAuthetication(er, re)} />
      </div>
    );
  }

}

export default CapsuleWallet; 