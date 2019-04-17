import React, { Component } from 'react';
import Wallet from 'capsule-wallet';


class TestWallet extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      provider: null,
      network: null,
      account: null,
      balance: null,
      txId: null,
      error: null
    }

    this.register = this.register.bind(this);
    this.done = this.done.bind(this);
    this.sendTx = this.sendTx.bind(this);
  }

  register(force) {
    if (force) {
      this.setState({ visible: false }, function () {
        this.setState({ visible: true });
      });
    }
    else this.setState({ visible: true });
  }

  done(er, provider) {
    var self = this;
    if (er) return this.setState({ error: JSON.stringify(er) });

    provider.watch().then(watcher => {
      watcher.event.on('data', re => {
        console.log("DEBUG", re)
        return self.setState(re);
      });
      watcher.event.on('error', er => {
        console.log("DEBUG", er)
        return self.setState({ error: JSON.stringify(er) });
      });
    }).catch(er => {
      return self.setState({ error: JSON.stringify(er) });
    });

    return this.setState({ provider: provider });
  }

  sendTx() {
    var self = this;
    var provider = this.state.provider;
    provider.web3.eth.sendTransaction({
      from: self.state.account,
      to: '0x5a926b235e992d6ba52d98415e66afe5078a1690',
      value: '1000000000000000'
    }, function (er, txId) {
      if (er) return self.setState({ error: JSON.stringify(er) });
      return self.setState({ txId: txId.toString() });
    });
  }

  render() {
    return (
      <div>
        <h1>Wallet testing</h1>
        <button onClick={() => this.register(true)}>Register</button>

        <div>
          <p>Network: {this.state.network}</p>
          <p>Account: {this.state.account}</p>
          <p>Balance: {this.state.balance}</p>
          <p>Previous tx id: <a target="_blank" rel="noopener noreferrer" href={"https://rinkeby.etherscan.io/tx/" + this.state.txId}>{this.state.txId}</a></p>
          <button onClick={this.sendTx}>Send Tx</button>
          {this.state.error ? <a >{this.state.error}</a> : null}
        </div>
        <Wallet visible={this.state.visible} net={4} done={this.done} />
      </div>
    );
  }
}

export default TestWallet;