var WalletInterface = require('../interface/walletInterface');
var MEWconnect = require('@myetherwallet/mewconnect-web-client');
var Provider = require('../provider');

const SIGNALER_URL = 'https://connect.mewapi.io';
const ERROR = 'The connection was expired';


class MEW extends WalletInterface {
  constructor(net, type, restrict) {
    super(net, type, restrict);

    this.mewConnectClient = new MEWconnect.Initiator();
    this.mewConnectClient.preventDuplicatedEvents = false;

    this.mewConnectClient.on('RtcClosedEvent', () => {
      console.log('RtcClosedEvent')
    });
    this.mewConnectClient.on('RtcDisconnectEvent', () => {
      console.log('RtcDisconnectEvent')
    });
  }

  setAccountByMEW(getAuthentication, callback) {
    var self = this;
    this.mewConnectClient.on('codeDisplay', code => {
      return getAuthentication.open(code, (er, re) => {
        // User close authentication modal
        if (er) return callback(er, null);
      });
    });
    this.mewConnectClient.initiatorStart(SIGNALER_URL);
    this.mewConnectClient.on('RtcConnectedEvent', () => {
      if (self.mewConnectClient.preventDuplicatedEvents) return; // Prevent double calls
      self.mewConnectClient.preventDuplicatedEvents = true;
      getAuthentication.close();
      self.provider = new Provider.HybridWallet(self.net);
      var accOpts = {
        getAddress: (cb) => self.getAddress(cb),
        signTransaction: (tx, cb) => self.signTransaction(tx, cb),
      }
      self.provider.init(accOpts, function (er, web3) {
        if (er) return callback(er, null);
        self.web3 = web3;
        return callback(null, web3);
      });
    });
  }

  getAccountByMEW(callback) {
    return this.getAddress(callback);
  }

  getAddress(callback) {
    if (this.mewConnectClient.connected) {
      this.mewConnectClient.sendRtcMessage('address', '');
      this.mewConnectClient.once('address', data => {
        return callback(null, data.address);
      });
    } else {
      return callback(ERROR, null);
    }
  }

  signTransaction(txParams, callback) {
    if (this.mewConnectClient.connected) {
      this.mewConnectClient.sendRtcMessage('signTx', txParams);
      this.mewConnectClient.once('signTx', data => {
        return callback(null, data);
      });
    }
    else {
      return callback(ERROR, null);
    }
  }
}

module.exports = MEW;