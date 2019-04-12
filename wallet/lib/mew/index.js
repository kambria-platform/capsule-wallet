var WalletInterface = require('../interface/walletInterface');
var MEWconnect = require('@myetherwallet/mewconnect-web-client');
var Provider = require('../provider');

const SIGNALER_URL = 'https://connect.mewapi.io';


class MEW extends WalletInterface {
  constructor(net, type, restrict) {
    super(net, type, restrict);

    this.mewConnectClient = new MEWconnect.Initiator();
    this.connected = false;

    var self = this;
    this.mewConnectClient.on('RtcClosedEvent', () => { self.connected = false; });
    this.mewConnectClient.on('RtcDisconnectEvent', () => { self.connected = false; });
    this.mewConnectClient.on('RtcErrorEvent', (er) => { console.error(er) });
  }

  setAccountByMEW(getAuthentication, callback) {
    var self = this;
    this.mewConnectClient.on('codeDisplay', code => {
      return getAuthentication.open(code);
    });
    this.mewConnectClient.initiatorStart(SIGNALER_URL);
    this.mewConnectClient.on('RtcConnectedEvent', () => {
      self.connected = true;
      getAuthentication.close();

      self.provider = new Provider.HybridWallet(this.net);
      var accOpts = {
        getAddress: (cb) => self.getAddress(getAuthentication, cb),
        signTransaction: (tx, cb) => self.signTransaction(getAuthentication, tx, cb),
      }
      self.provider.init(accOpts, function (er, web3) {
        if (er) return callback(er, null);
        self.web3 = web3;
        return callback(null, web3);
      });
    });
  }

  getAccountByMEW(getAuthentication, callback) {
    return this.getAddress(getAuthentication, callback);
  }

  getAddress(getAuthentication, callback) {
    var self = this;
    if (this.connected) {
      this.mewConnectClient.sendRtcMessage('address', '');
      this.mewConnectClient.once('address', data => {
        return callback(null, data.address);
      });
    } else {
      this.mewConnectClient.on('codeDisplay', code => {
        return getAuthentication.open(code);
      });
      this.mewConnectClient.initiatorStart(SIGNALER_URL);
      this.mewConnectClient.on('RtcConnectedEvent', () => {
        self.connected = true;
        getAuthentication.close();

        this.mewConnectClient.sendRtcMessage('address', '');
        this.mewConnectClient.once('address', data => {
          return callback(null, data.address);
        });
      });
    }
  }

  signTransaction(getAuthentication, txParams, callback) {
    var self = this;
    if (this.connected) {
      this.mewConnectClient.sendRtcMessage('signTx', txParams);
      this.mewConnectClient.once('signTx', data => {
        return callback(null, data);
      });
    }
    else {
      this.mewConnectClient.on('codeDisplay', code => {
        return getAuthentication.open(code);
      });
      this.mewConnectClient.initiatorStart(SIGNALER_URL);
      this.mewConnectClient.on('RtcConnectedEvent', () => {
        self.connected = true;
        getAuthentication.close();

        this.mewConnectClient.sendRtcMessage('signTx', txParams);
        this.mewConnectClient.once('signTx', data => {
          return callback(null, data);
        });
      });
    }
  }
}

module.exports = MEW;