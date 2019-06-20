# Introduction

Capsule Wallet is a blockchain bridge help you to power your Dapp. Capsule wallet is based on [Kambria Wallet's core](https://github.com/kambria-platform/kambria-wallet) with the high security and the transparency as a React component to quick develop as well.

Capsule Wallet is a community software and you can feel free to use it as well as contribute it.

* [View release log](./RELEASE.md)

# How to use?

## Install

```
npm install --save capsule-wallet
```

## Configuration

### Basic use:

Capsule Wallet component has 3 props:

* `visible`: takes boolean value to toogle the process.
* `options`: includes `networkId`, `restrictedNetwork` and `pageRefreshing`.
  * `networkId`: <Number> Ethereum network id [(Network id detail)](https://ethereum.stackexchange.com/questions/17051/how-to-select-a-network-id-or-is-there-a-list-of-network-ids). Default: `1`.
  * `restrictedNetwork`: <Boolean> Allow or not changing network when operating (Mostly for Metamask, in case of `false`, if you change the network, it would not release any error). Default: `true`.
  * `pageRefreshing`: <Boolean> Support or not Page-Refreshing (if `true`, your account will be kept at the end of session even though window refreshing). Default: `false`.
* `done`: callback function that returns the provider when register had done.

```
import Wallet from 'capsule-wallet';

// ... Something React here

render() {
  <Wallet visible={visible} options={options} done={callback} />
}
```

Returned provider will be assigned in `window.capsuleWallet.provider` as a global variable for your Dapp can access it anywhere.

# Examples

```
import React, { Component } from 'react';
import Wallet from 'capsule-wallet';


class Example extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      options: {
        networkId: 4,
        restrictedNetwork: true,
        pageRefreshing: true
      }
    }

    this.register = this.register.bind(this);
    this.done = this.done.bind(this);
  }

  register() {
    this.setState({ visible: true });
  }

  done(er, provider) {
    if (er) return console.error(er);
    if(!provider) return console.error('User skipped to connect to the wallet');

    console.log('Web3:', provider.web3);
    console.log('Also web3:', window.capsuleWallet.provider.web3);
  }

  render() {
    return (
      <div>
        <button onClick={this.register}>Register</button>
        <Wallet visible={this.state.visible} options={this.state.options} done={this.done} />
      </div>
    );
  }
}

export default Example;
```

# How to test?

## Unit test

```
Not yet
```

## Tool test

```
npm start
```

The app will be run on port `3000` with `https` and support hot-loading. (If the browser asks something, please trust it and process straight forward)

# Appendix

## Version of important dependencies

Because we're using `capsule-core-js` which based on `web3@^0.20.7`, so we are.

```
"web3": "^0.20.7"
```

## Cheatsheet

|   #   | Commands        | Descriptions                  |
| :---: | --------------- | ----------------------------- |
|   1   | `npm install`   | Install module packages       |
|   2   | `npm run build` | Build libraries in production |
|   3   | `npm start`     | Run tool test                 |