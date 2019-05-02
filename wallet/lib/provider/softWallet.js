var ethUtil = require('ethereumjs-util');
var cryptoJS = {
  AES: require('crypto-js/aes'),
  PBKDF2: require('crypto-js/pbkdf2'),
  enc: { Utf8: require('crypto-js/enc-utf8') },
  lib: { WordArray: require('crypto-js/lib-typedarrays') }
}
var Engine = require('./engine').zeroc;
var Store = require('./store').sessionStorage;
var util = require('../util');

const error = require('../constant/error');

class SoftWallet {
  /**
   * @constructor
   * @param {*} net - chainCode
   * @param {*} accOpts - accOpts = {
   *   address: ...
   *   privateKey: ...
   *   getPassphrase: ...
   * }
   */
  constructor(net) {
    this.network = util.chainCode(net, 'number');
    this.store = new Store();
  }

  /**
   * @func opts
   * Define optional functions for engine
   */
  opts() {
    var self = this;
    return {
      dataHandler: function () { /* Turn off default logs */ },
      errorHandler: function () { /* Turn off dÎefault logs */ },
      getAccounts: function (callback) {
        var accounts = self.getAddress();
        return callback(null, accounts);
      },
      approveTransaction: function (txParams, callback) {
        return callback(null, true);
      },
      signTransaction: function (txParams, callback) {
        txParams.chainId = self.network;
        self.getPassphrase(function (er, passphrase) {
          if (er || !passphrase) return callback(error.CANNOT_UNLOCK_ACCOUNT, null);
          var priv = self.unlockAccount(passphrase);
          if (!priv) return callback(error.CANNOT_UNLOCK_ACCOUNT, null);
          var signedTx = util.signRawTx(txParams, priv);
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
    var self = this;
    accOpts = accOpts || {};
    this.getPassphrase = accOpts.getPassphrase;
    var engine = new Engine(this.network, this.opts());
    this.setAccount(accOpts.address, accOpts.privateKey, accOpts.getPassphrase, function (er, re) {
      if (er) return callback(error.CANNOT_SET_ACCOUNT, null);
      self.web3 = engine.web3;
      return callback(null, self.web3);
    });
  }

  /**
   * @func setAccount
   * Set up coinbase (internal function)
   * @param {string} address 
   * @param {string} privateKey 
   * @param {function} passphrase 
   */
  setAccount(address, privateKey, getPassphrase, callback) {
    var self = this;

    if (!address || !privateKey) return callback('Address or Private Key must be not null', null);
    if (!this.validatePrivateKey(address, privateKey)) return callback('Invalid address or private key', null);
    if (!getPassphrase || typeof getPassphrase !== 'function') return callback('getPassphrase must be not a function', null);

    address = address.toLowerCase();
    privateKey = privateKey.toLowerCase();
    getPassphrase(function (er, passphrase) {
      if (er) return callback(er, null);
      if (!passphrase) return callback(er, 'User denied unlocking account');

      passphrase = passphrase.toString();
      var salt = cryptoJS.lib.WordArray.random(128 / 8);
      var password = self.constructPassword(passphrase, salt);
      if (!password) return callback('Cannot set up password', null);

      var encryptedPriv = cryptoJS.AES.encrypt(privateKey, password).toString();
      var acc = {
        ADDRESS: address,
        PRIVATEKEY: encryptedPriv,
        SALT: salt
      };

      self.store.set('ACCOUNT', acc);
      return callback(null, acc);
    });
  }

  /**
   * @func validatePrivateKey
   * Double check the pair of address/privatekey
   * @param {*} addr 
   * @param {*} priv 
   */
  validatePrivateKey(addr, priv) {
    if (!addr || !priv) return false;
    priv = new Buffer(priv, 'hex');
    var valid = true;
    valid = valid && ethUtil.isValidPrivate(priv);
    var _addr = '0x' + ethUtil.privateToAddress(priv).toString('hex');
    valid = valid && (_addr === addr);
    return valid;
  }

  /**
   * @func constructPassword
   * Construct password from passphrase and salt
   * @param {*} passphrase 
   * @param {*} salt 
   */
  constructPassword(passphrase, salt) {
    if (!passphrase || !salt) return null;
    var password = cryptoJS.PBKDF2(passphrase, salt, { keySize: 512 / 32, iterations: 1000 });
    return password.toString();
  }

  /**
   * @func unlockAccount
   * Internal function, that acctually does unlocking acc.
   * @param {*} passphrase 
   */
  unlockAccount(passphrase) {
    try {
      var password = this.constructPassword(passphrase, this.getSalt());
      var enpriv = this.getPrivateKey();
      if (!password || !enpriv) return null;
      var priv = cryptoJS.AES.decrypt(enpriv, password);
      if (!priv) return null;
      priv = priv.toString(cryptoJS.enc.Utf8);
      return priv;
    } catch (er) { return null; } // Try catch unexpected Error
  }

  /**
   * Functions for reading store
   */
  getAddress() {
    var acc = this.store.get('ACCOUNT');
    if (!acc || typeof acc !== 'object') return [];
    return [acc.ADDRESS];
  }
  getPrivateKey() { // the encrypted form of private key
    var acc = this.store.get('ACCOUNT');
    if (!acc || typeof acc !== 'object') return null;
    return acc.PRIVATEKEY;
  }
  getSalt() {
    var acc = this.store.get('ACCOUNT');
    if (!acc || typeof acc !== 'object') return null;
    return acc.SALT;
  }
}

module.exports = SoftWallet;