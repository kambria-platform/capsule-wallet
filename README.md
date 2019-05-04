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
* `net`: Ethereum network id [(Network id detail)](https://ethereum.stackexchange.com/questions/17051/how-to-select-a-network-id-or-is-there-a-list-of-network-ids).
* `done`: callback function that returns the provider when register had done.

```
import Wallet from 'capsule-wallet';

// ... Something React here

render() {
  <Wallet visible={visible} net={networkId} done={callback} />
}
```

Returned provider will be assigned in `window.capsuleWallet.provider` as a global variable for your Dapp can access it anywhere.

### Advance use:

If you don't want to use the default UI or user flow, you could develop another one on the Capsule Wallet's core.

```
import { Metamask, MEW, Ledger, Isoxys } from 'capsule-wallet';
```

Following the API section below to see the configuration for using the modules.

# API

## Metamask module

```
import { Metamask } from 'capsule-wallet';

var net = 4 \\ Your network id
var type = 'softwallet' \\ Don't modify it
var restrictMode = true \\ If true, this mode won't allow network changing. If false, vice versa.

var metamask = new Metamask(net, type, restrictMode);
metamask.setAccountByMetamask(function (er, re) {
  if (er) return console.error(er);

  console.log('Provider instance is:', metamask);
});
```

## MEW (MyEtherwallet) module

```
import { MEW } from 'capsule-wallet';

var net = 4 \\ Your network id
var type = 'hybridwallet' \\ Don't modify it
var restrictMode = true \\ If true, this mode won't allow network changing. If false, vice versa.

var getAuthentication = function(qrcode, callback) {
  // This function is to show off the QRcode to user
  // User must user MEW on thier phone to scan the QRcode to establish the connection
  // When the connection is established, callback will be call
}

var mew = new MEW(net, type, restrictMode);
mew.setAccountByMEW(getAuthentication, (er, re) => {
  if (er) return console.error(er);

  console.log('Provider instance is:', mew);
});
```

## Isoxys module

Isoxys is a group of software wallets. It includes mnemonic, keystore and private key. All of them are sensitive data, so we do not recommend to use it.

```
import { Isoxys } from 'capsule-wallet';

var net = 4 \\ Your network id
var type = 'softwallet' \\ Don't modify it
var restrictMode = true \\ If true, this mode won't allow network changing. If false, vice versa.

var getPassphrase = function(callback) {
  // This function to show off the input form
  // User must enter a temporary passphrase to protect the data in this session
  // When user entered passphrase, return callback(null, passphrase)
  // If denied, return callback('Reason msg', null)
}

var isoxys = new Isoxys(net, type, restrictMode);


// Privatekey

var privatekey = ... // Private key
isoxys.getAccountByPrivatekey(privatekey, (er, address) => {
  if (er) return console.error(er);

  console.log('Address:', address);
});

var privatekey = ... // Private key
isoxys.setAccountByPrivatekey(privatekey, getPassphrase, (er, re) => {
  if (er) return console.error(er);

  console.log('Provider instance is:', isoxys);
});


// Mnemonic

var mnemonic = ... // Mnemonic string
var password = ... // Mnemonic password
var path = ... // Derivation path
var limit = ... // The number of records in a page (pagination)
var page = ... // Page index (pagination)
isoxys.getAccountsByMnemonic(mnemonic, password, path, limit, page, (er, addresses) => {
  if (er) return console.error(er);

  console.log('Address list:', addresses);
});

var mnemonic = ... // Mnemonic string
var password = ... // Mnemonic password
var path = ... // Derivation path
var index = ... // Derivation child index
isoxys.setAccountByMnemonic(mnemonic, password, path, index, getPassphrase, (er, re) => {
  if (er) return console.error(er);

  console.log('Provider instance is:', isoxys);
});


// Keystore

var input = ... // Json object of keystore
var password = .. // Keystore password
isoxys.getAccountByKeystore(input, password, (er, address) => {
  if (er) return console.error(er);

  console.log('Address:', address);
});

var input = ... // Json object of keystore
var password = .. // Keystore password
isoxys.setAccountByKeystore(input, password, getPassphrase, (er, re) => {
  if (er) return console.error(er);

  console.log('Provider instance is:', isoxys);
});
```

## Ledger module

```
import { Ledger } from 'capsule-wallet';

var net = 4 \\ Your network id
var type = 'hardwallet' \\ Don't modify it
var restrictMode = true \\ If true, this mode won't allow network changing. If false, vice versa.

var ledger = new Ledger(net, type, restrictMode);

var path = ... // Derivation path
var limit = ... // The number of records in a page (pagination)
var page = ... // Page index (pagination)
ledger.getAccountsByLedgerNanoS(path, limit, page, (er, addresses) => {
  if (er) return console.error(er);

  console.log('Address list:', addresses);
});

var path = ... // Derivation path
var index = ... // Derivation child index
ledger.setAccountByLedgerNanoS(path, index, (er, re) => {
  if (er) return console.error(er);

  console.log('Provider instance is:', ledger);
});
```

## Trezor module

```
import { Trezor } from 'capsule-wallet';

var net = 4 \\ Your network id
var type = 'hardwallet' \\ Don't modify it
var restrictMode = true \\ If true, this mode won't allow network changing. If false, vice versa.

var trezor = new Trezor(net, type, restrictMode);

var path = ... // Derivation path
var limit = ... // The number of records in a page (pagination)
var page = ... // Page index (pagination)
trezor.getAccountsByTrezorOne(path, limit, page, (er, addresses) => {
  if (er) return console.error(er);

  console.log('Address list:', addresses);
});

var path = ... // Derivation path
var index = ... // Derivation child index
trezor.setAccountByTrezorOne(path, index, (er, re) => {
  if (er) return console.error(er);

  console.log('Provider instance is:', trezor);
});
```

# Examples

## Basic example

```
import React, { Component } from 'react';
import Wallet from 'capsule-wallet';


class Example extends Component {
  constructor() {
    super();
    this.state = {
      visible: false
    }

    this.register = this.register.bind(this);
    this.done = this.done.bind(this);
  }

  register() {
    this.setState({ visible: true });
  }

  done(er, provider) {
    if (er) return console.error(er)

    console.log('Web3:', provider.web3)
    console.log('Also web3:', window.capsuleWallet.provider.web3)
  }

  render() {
    return (
      <div>
        <button onClick={this.register}>Register</button>
        <Wallet visible={this.state.visible} net={4} done={this.done} />
      </div>
    );
  }
}

export default Example;
```

## Advance examples

```
import React, { Component } from 'react';
import { Isoxys } from 'capsule-wallet';

const NETWORK = 'rinkeby';
const TYPE = 'softwallet';
const RESTRICT = true;

const accOpts = {
  mnemonic: 'expand lake',
  password: null,
  path: "m/44'/60'/0'/0",
  i: 0
}

class Example extends Component {
  constructor() {
    super();

    this.isoxys = new Isoxys(NETWORK, TYPE, RESTRICT);
  }

  componentDidMount() {
    var self = this;
    this.isoxys.setAccountByMnemonic(accOpts.mnemonic, accOpts.password, accOpts.path, accOpts.index, this.getPassphrase, (er, re) => {
      if (er) return console.error(er);

      console.log('Provider instance is:', self.isoxys);
    });
  }

  getPassphrase(callback) {
    var passphrase = window.prompt('Please enter passphrase:');
    if (!passphrase) return callback('User denied signing transaction', null);
    return callback(null, passphrase);
  }
}

export default Example;
```

# For Contributors

## The structure

The `wallet` folder contains the main source code. It has 2 sub-folders namely `lib` and `skin`, `lib` contains source code of the zero clients, `skin` contains source code of React.

The `src` folder contains test files. However, it can be viewed as an example, so
to know how to use them, you can refer to `src/*` for details.

## How to build library?

```
npm run build
```

The `index.js` file and `dist` folder would be the destination of compiling.

## How to test?

### Unit test

```
Not yet
```

### Tool test

```
npm start
```

The app will be run on port `3000` with `https` and support hot-loading. (If the browser asks something, please trust it and process straight forward)

## Appendix

### Version of important dependencies

```
"web3": "^0.20.6"
```

### Cheatsheet

|   #   | Commands        | Descriptions                  |
| :---: | --------------- | ----------------------------- |
|   1   | `npm install`   | Install module packages       |
|   2   | `npm run build` | Build libraries in production |
|   3   | `npm start`     | Run tool test                 |