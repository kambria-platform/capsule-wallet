var WalletInterface = require('../interface/walletInterface');
var util = require('../util');
var Provider = require('../provider');
var LedgerNanoS = require('./ledgerNanoS');
var cache = require('../cache');


class Ledger extends WalletInterface {
  constructor(net, type, restrict) {
    super(net, type, restrict);
  }

  /**
   * @func setWallet
   * (Internal function) Set up acc to store that can be used as a wallet
   * @param {*} accOpts 
   */
  setWallet(accOpts, callback) {
    var self = this;
    this.provider = new Provider.HardWallet(this.net);
    this.provider.init(accOpts, function (er, web3) {
      if (er) return callback(er, null);
      self.web3 = web3;
      return callback(null, web3);
    });
  }

  /**
   * LEDGER Nano S
   */

  /**
   * @func setAccountByLedgerNanoS
   * Set account by Ledger Nano S
   * @param {*} path - root derivation path (m/44'/60'/0'/0 as default)
   * @param {*} index - (optional)
   */
  setAccountByLedgerNanoS(path, index, callback) {
    let getAddress = function (dpath, callback) {
      let loadedAddressFromCache = cache.get('ledgerNanoS-childAddress-' + dpath);
      if (loadedAddressFromCache) return callback(null, loadedAddressFromCache);
      return LedgerNanoS.getAddress(dpath, callback);
    }
    var account = {
      getAddress: getAddress,
      signTransaction: LedgerNanoS.signTransaction,
      path: path,
      index: index
    }
    this.setWallet(account, callback);
  }

  /**
   * @func getAccountsByLedgerNanoS
   * Get list of accounts by Ledger Nano S
   * @param {*} path - root derivation path (m/44'/60'/0'/0 as default)
   * @param {*} limit 
   * @param {*} page 
   */
  getAccountsByLedgerNanoS(path, limit, page, callback) {
    let done = function (root) {
      let addresses = util.deriveChild(limit, page, root.publicKey, root.chainCode).map(item => {
        cache.set('ledgerNanoS-childAddress-' + util.addDPath(path, item.index), item.address, 300);
        return item.address;
      });
      return callback(null, addresses);
    }

    if (cache.get('ledgerNanoS-rootNode-' + path)) {
      let re = cache.get('ledgerNanoS-rootNode-' + path);
      return done(re);
    }
    else {
      LedgerNanoS.getPublickey(path, function (er, re) {
        if (er) return callback(er, null);

        cache.set('ledgerNanoS-rootNode-' + path, re, 300);
        return done(re);
      });
    }
  }
}

module.exports = Ledger;