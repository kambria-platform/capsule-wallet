var WalletInterface = require('../interface/walletInterface');
var util = require('../util');
var Web3 = require('web3');

const ERROR = require('../constant/error');

class Metamask extends WalletInterface {
  constructor(net, type, restrict) {
    super(net, type, restrict);
  }

  setAccountByMetamask(callback) {
    var self = this;
    this.provider = window.ethereum;
    if (!this.provider)
      return callback(ERROR.CANNOT_FOUND_PROVIDER, null);
    if (util.getNetworkId(this.provider.networkVersion, 'number') != util.getNetworkId(this.net, 'number'))
      return callback(ERROR.INVALID_NETWORK, null);

    this.provider.enable().then(re => {
      self.web3 = new Web3(self.provider);
      return callback(null, web3);
    }).catch(er => {
      return callback(er, null);
    });
  }
}

module.exports = Metamask;