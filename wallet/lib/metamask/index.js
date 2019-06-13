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

    // networkVersion delayed sometime, so we give it a chance
    setTimeout(function () {
      if (util.getNetworkId(self.provider.networkVersion, 'number') != util.getNetworkId(self.net, 'number'))
        return callback(ERROR.INVALID_NETWORK, null);

      self.provider.enable().then(re => {
        self.web3 = new Web3(self.provider);
        return callback(null, self.web3);
      }).catch(er => {
        return callback(er, null);
      });
    }, 1000); // Wait for 1 minute
  }
}

module.exports = Metamask;