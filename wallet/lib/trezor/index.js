var WalletInterface = require('../interface/walletInterface');
var util = require('../util');
var Provider = require('../provider');
var TrezorOne = require('./trezorOne');

class Trezor extends WalletInterface {
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
   * Trezor One
   */

  /**
   * @func setAccountByTrezorOne
   * Set account by Trezor One
   * @param {*} path - root derivation path (m/44'/60'/0'/0 as default)
   * @param {*} index - (optional)
   */
  setAccountByTrezorOne(path, index, callback) {
    var account = {
      getAddress: TrezorOne.getAddress,
      signTransaction: TrezorOne.signTransaction,
      path: path,
      index: index
    }
    this.setWallet(account, callback);
  }

  /**
   * @func getAccountsByTrezorOne
   * Get list of accounts by Trezor One
   * @param {*} path - root derivation path (m/44'/60'/0'/0 as default)
   * @param {*} limit 
   * @param {*} page 
   */
  getAccountsByTrezorOne(path, limit, page, callback) {
    var coll = [];
    for (var index = page * limit; index < page * limit + limit; index++) {
      coll.push(index);
    }

    if (!path) {
      return callback(null, []);
    } else if (coll.length > 0) {
      var dpath = coll.map(item => {
        return util.addDPath(path, item);
      });
      TrezorOne.getAddress(dpath, function (er, re) {
        if (er) return callback(er, null);
        return callback(null, re);
      });
    }
    else {
      return callback(null, []);
    }
  }
}

module.exports = Trezor;