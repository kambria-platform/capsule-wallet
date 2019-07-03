import React, { Component } from 'react';
import Wallet from 'capsule-wallet';

// Fake css to test scope
import style from './index.module.css';

const NET = {
  MAINNET: {
    id: 1,
    etherscan: ''
  },
  ROPSTEN: {
    id: 3,
    etherscan: 'ropsten.'
  },
  KOVAN: {
    id: 42,
    etherscan: 'kovan.'
  },
  RINKEBY: {
    id: 4,
    etherscan: 'rinkeby.'
  },
  GOERLI: {
    id: 5,
    etherscan: 'goerli.'
  },
}

const DEFAULT_STATE = {
  visible: false,
  network: null,
  account: null,
  balance: null,
  txId: null
}

class TestWallet extends Component {
  constructor() {
    super();

    this.state = { ...DEFAULT_STATE };

    // Test params here
    this.net = 'ROPSTEN';
    this.options = {
      networkId: NET[this.net].id,
      restrictedNetwork: true,
      pageRefreshing: true
    };
  }

  register = () => {
    this.setState({ visible: false }, () => {
      this.setState({ visible: true });
    });
  }

  logout = () => {
    window.capsuleWallet.logout();
  }

  done = (er, provider) => {
    if (er) return console.error(er);
    if (!provider) return console.error('Use skip the registration');

    window.capsuleWallet.provider.watch().then(watcher => {
      watcher.event.on('data', re => {
        return this.setState(re);
      });
      watcher.event.on('error', er => {
        if (er) return console.error(er);
      });
    }).catch(er => {
      if (er) return console.error(er);
    });
  }

  sendTx = () => {
    window.capsuleWallet.provider.web3.eth.sendTransaction({
      from: this.state.account,
      to: '0x5a926b235e992d6ba52d98415e66afe5078a1690',
      value: '1000000000000000'
    }, (er, txId) => {
      if (er) return console.error(er);
      return this.setState({ txId: txId.toString(), error: null });
    });
  }

  render() {
    return (
      <div>
        <h1 className={style.secondary}>Wallet testing</h1>
        <button onClick={this.register}>Register</button>

        <div>
          <p>Network: {this.state.network}</p>
          <p>Account: {this.state.account}</p>
          <p>Balance: {this.state.balance}</p>
          <p>Previous tx id: <a target="_blank" rel="noopener noreferrer" href={`https://${NET[this.net].etherscan}etherscan.io/tx/${this.state.txId}`}>{this.state.txId}</a></p>
          <button onClick={this.sendTx}>Send Tx</button>
          <button onClick={this.logout}>Logout</button>
          {this.state.error ? <p>{this.state.error}</p> : null}
        </div>
        <Wallet
          visible={this.state.visible}
          options={this.options}
          done={this.done} />
      </div>
    );
  }
}

export default TestWallet;