var Engine = require('./engine').zeroc;
var util = require('../util');

const error = require('../constant/error');

class HybridWallet {
  /**
   * @constructor
   * @param {*} net - chainCode
   * @param {*} accOpts - accOpts = {
   *   signTransaction: (function) ...
   *   getAddress: (function) ...
   * }
   */
  constructor(net) {
    this.network = util.chainCode(net);
  }

  /**
   * @func opts
   * Define optional functions for engine
   */
  opts() {
    var self = this;
    return {
      dataHandler: function () { /* Turn off default logs */ },
      errorHandler: function () { /* Turn off default logs */ },
      getAccounts: function (callback) {
        self.hybridware.getAddress(function (er, addr) {
          if (er) return callback(er, null);
          if (!addr) return callback(null, []);
          return callback(null, [addr.toLowerCase()]);
        })
      },
      approveTransaction: function (txParams, callback) {
        return callback(null, true);
      },
      signTransaction: function (txParams, callback) {
        txParams.chainId = self.network;
        var tx = util.genRawTx(txParams, self.network);
        console.log("Tx content:", txParams)
        self.hybridware.signTransaction(txParams, function (er, signature) {
          if (er) return callback(er, null);
          var signedTx = tx.raw;
          signedTx.v = Buffer.from(signature.v, 'hex');
          signedTx.r = Buffer.from(signature.r, 'hex');
          signedTx.s = Buffer.from(signature.s, 'hex');
          console.log("Tx signed:", signature)
          return callback(null, util.padHex(signedTx.serialize().toString('hex')));
        });
      }
    }
  }

  /**
   * @func init
   * Initialize web3 
   * @param {*} accOpts 
   * @param {*} callback 
   */
  init(accOpts, callback) {
    accOpts = accOpts || {};
    var engine = new Engine(this.network, this.opts());
    this.hybridware = null;
    var ok = this.setAccount(accOpts.getAddress, accOpts.signTransaction);
    if (!ok) return callback(error.CANNOT_SET_ACCOUNT, null);
    this.web3 = engine.web3;
    // We used callback to fomalize code interface with other classes
    return callback(null, this.web3);
  }

  /**
   * @func setAccount
   * Set up coinbase
   * @param {*} address 
   */
  setAccount(getAddress, signTransaction) {
    if (!getAddress || typeof getAddress !== 'function') {
      console.error('getAddress must be a function');
      return false;
    }
    if (!signTransaction || typeof signTransaction !== 'function') {
      console.error('signTransaction must be a function');
      return false;
    }

    this.hybridware = { getAddress: getAddress, signTransaction: signTransaction };
    return true;
  }
}

module.exports = HybridWallet;