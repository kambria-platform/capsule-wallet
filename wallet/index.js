import React, { Component } from 'react';
import FiniteStateMachine from './finiteStateMachine';
import Modal from './skin/react/core/modal';

import 'Style/index.scss';

import Header from './skin/react/core/header';
import InputPassphrase from './skin/react/core/inputPassphrase';
import ErrorForm from './skin/react/core/error';
import Author from './skin/react/core/author';
import Footer from './skin/react/core/footer';

import SellectWallet from './skin/react/sellectWallet';
import InputAsset from './skin/react/inputAsset';
import ConnectDevice from './skin/react/connectDevice';
import ConfirmAddress from './skin/react/confirmAddress';


const ERROR = 'Wallet was broken';
const DEFAULT_STATE = {
  visible: false,
  step: 'Idle',
  error: '',
  passphrase: false
}


class CapsuleWallet extends Component {

  /**
   * @props net - Chain code
   * @props visible - Boolean
   * @props done - Callback function
   */
  constructor(props) {
    super(props);

    this.FSM = new FiniteStateMachine();

    this.state = {
      net: this.props.net ? this.props.net : 1, // mainnet as default
      ...DEFAULT_STATE
    }

    if (this.props.visible) this.setState({ step: this.FSM.next().step });
    this.done = this.props.done;
    this.onData = this.onData.bind(this);
    this.onClose = this.onClose.bind(this);

    var self = this;
    window.capsuleWallet = { author: 'Tu Phan', git: 'https://github.com/sontuphan/capsule-wallet' }
    window.capsuleWallet.getPassphrase = function (callback) {
      self.setState({ passphrase: false, returnPassphrase: null }, () => {
        self.setState({ passphrase: true, returnPassphrase: callback });
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) this.setState({ visible: true, step: this.FSM.next().step });
      else this.setState(DEFAULT_STATE);
    }
  }

  /**
   * Flow management
   */

  onData(er, re) {
    let self = this;

    if (er) return self.setState({ error: er, step: 'Error' }, () => {
      self.FSM.reset();
    });

    if (!re) return self.onClose(() => {
      self.done(null, null);
    }); // Use skip the registration.

    let state = self.FSM.next(re);
    if (state.step === 'Error') return self.setState({ error: ERROR, step: state.step }, () => {
      self.FSM.reset();
    });

    if (state.step === 'Success') return self.onClose(() => {
      self.done(null, state.provider);
    });

    return self.setState({ step: state.step });
  }

  onClose(callback) {
    this.setState({ visible: true }, () => {
      this.setState({ visible: false }, () => {
        if (callback) callback();
        this.setState(DEFAULT_STATE, () => {
          this.FSM.reset();
        });
      });
    });
  }

  render() {
    return (
      <div>
        <Modal visible={this.state.visible && !this.state.passphrase} className="animated slideInUp" >
          <div className="modal-body wallet">
            <div className="row justify-content-end">
              <button className="close-btn" onClick={() => this.onClose()} />
            </div>
            <div className="container">
              <Header />
              {this.state.step === 'SelectWallet' ? <SellectWallet data={{ ...this.FSM.data, net: this.state.net }} done={this.onData} /> : null}
              {this.state.step === 'InputAsset' ? <InputAsset data={{ ...this.FSM.data, net: this.state.net }} done={this.onData} /> : null}
              {this.state.step === 'ConnectDevice' ? <ConnectDevice data={{ ...this.FSM.data, net: this.state.net }} done={this.onData} /> : null}
              {this.state.step === 'ConfirmAddress' ? <ConfirmAddress data={{ ...this.FSM.data, net: this.state.net }} done={this.onData} /> : null}
              {this.state.step === 'Error' ? <ErrorForm error={this.state.error} done={() => this.onClose(() => { this.done(this.state.error, null) })} /> : null}
              <Footer skip={() => this.onClose()} />
            </div>
          </div>
          <Author />
        </Modal>

        <InputPassphrase visible={this.state.passphrase} done={(er, re) => { this.state.returnPassphrase(er, re) }} />
      </div>
    );
  }

}

export default CapsuleWallet; 