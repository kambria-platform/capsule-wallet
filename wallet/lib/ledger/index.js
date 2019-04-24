var WalletInterface = require('../interface/walletInterface');
var async = {
  eachOfSeries: require('async/eachOfSeries')
}
var util = require('../util');
var Provider = require('../provider');
var LedgerNanoS = require('../ledger/ledgerNanoS');


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
   * Set account by ledger
   * @param {*} path - root derivation path (m/44'/60'/0' as default)
   * @param {*} index - (optional)
   */
  setAccountByLedgerNanoS(path, index, callback) {
    var account = {
      getAddress: LedgerNanoS.getAddress,
      signTransaction: LedgerNanoS.signTransaction,
      path: path,
      index: index
    }
    this.setWallet(account, callback);
  }

  /**
   * @func getAccountsByLedgerNanoS
   * Get list of accounts by ledger
   * @param {*} path - root derivation path (m/44'/60'/0' as default)
   * @param {*} limit 
   * @param {*} page 
   */
  getAccountsByLedgerNanoS(path, limit, page, callback) {
    var list = [];
    var coll = [];

    for (var index = page * limit; index < page * limit + limit; index++) {
      coll.push(index);
    }

    if (!path) {
      return callback(null, []);
    } else if (coll.length > 0) {
      async.eachOfSeries(coll, function (i, index, cb) {
        var dpath = util.addDPath(path, i);
        LedgerNanoS.getAddress(dpath, function (er, addr) {
          if (er) return cb(er);
          if (addr) list[index] = addr;
          return cb();
        });
      }, function (er) {
        if (er) return callback(er, null);
        return callback(null, list);
      });
    }
    else {
      return callback(null, []);
    }
  }
}

module.exports = Ledger;