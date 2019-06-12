var WalletInterface = require('../interface/walletInterface');
var util = require('../util');
var Provider = require('../provider');
var TrezorOne = require('./trezorOne');
var cache = require('../provider/store').cache;

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
    let getAddress = function (dpath, callback) {
      let loadedAddressFromCache = cache.get('trezorOne-childAddress-' + dpath);
      if (loadedAddressFromCache) return callback(null, loadedAddressFromCache);
      return TrezorOne.getAddress(dpath, callback);
    }
    var account = {
      getAddress: getAddress,
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
    let done = function (root) {
      let addresses = util.deriveChild(limit, page, root.publicKey, root.chainCode).map(item => {
        cache.set('trezorOne-childAddress-' + util.addDPath(path, item.index), item.address);
        return item.address;
      });
      return callback(null, addresses);
    }

    if (cache.get('trezorOne-rootNode-' + path)) {
      let re = cache.get('trezorOne-rootNode-' + path);
      return done(re);
    }
    else {
      TrezorOne.getPublickey(path, function (er, re) {
        if (er) return callback(er, null);

        cache.set('trezorOne-rootNode-' + path, re);
        return done(re);
      });
    }
  }
}

module.exports = Trezor;