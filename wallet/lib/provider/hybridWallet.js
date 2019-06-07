var Engine = require('./engine').zeroc;
var util = require('../util');

const error = require('../constant/error');

class HybridWallet {
  /**
   * @constructor
   * @param {*} net - Network id
   * @param {*} accOpts - accOpts = {
   *   signTransaction: (function) ...
   *   getAddress: (function) ...
   * }
   */
  constructor(net) {
    this.network = util.getNetworkId(net, 'number');
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
        self.getAddress(function (er, addr) {
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
        if (!txParams.data) txParams.data = '';
        self.signTransaction(JSON.stringify(txParams), function (er, signature) {
          if (er) return callback(er, null);
          var signedTx = util.genSignedTx(signature);
          return callback(null, signedTx);
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
    var ok = this.setAccount(accOpts.getAddress, accOpts.signTransaction);
    if (!ok) return callback(error.CANNOT_SET_ACCOUNT, null);
    // We used callback to fomalize code interface with other classes
    return callback(null, engine.web3);
  }

  /**
   * @func setAccount
   * Set up coinbase
   * @param {*} getAddress 
   * @param {*} signTransaction 
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

    this.getAddress = getAddress;
    this.signTransaction = signTransaction;
    return true;
  }
}

module.exports = HybridWallet;