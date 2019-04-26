var Isoxys = require('../../../lib/isoxys');
var Ledger = require('../../../lib/ledger');
var Trezor = require('../../../lib/trezor');

const DEFAULT_HD_PATH = "m/44'/60'/0'/0";
const ERROR = 'No address found';

class ConfirmAddressHelper {

  static getAddressByIsoxys(data, limit, page) {
    var isoxys = new Isoxys(window.capsuleWallet.net, data.type, true);
    return new Promise((resolve, reject) => {
      switch (data.subType) {
        // Mnemonic
        case 'mnemonic':
          return isoxys.getAccountsByMnemonic(
            data.asset.mnemonic,
            data.asset.password,
            DEFAULT_HD_PATH,
            limit,
            page,
            function (er, re) {
              if (er || re.length <= 0) return reject(ERROR);
              return resolve(re);
            });
        // Keystore
        case 'keystore':
          return isoxys.getAccountByKeystore(
            data.asset.keystore,
            data.asset.password,
            function (er, re) {
              if (er || !re) return reject(ERROR);
              return resolve([re]);
            });
        // Private key
        case 'private-key':
          return isoxys.getAccountByPrivatekey(
            data.asset.privateKey,
            function (er, re) {
              if (er || !re) return reject(ERROR);
              return resolve([re]);
            });
        // Error
        default:
          return reject(ERROR);
      }
    });
  }

  static setAddressByIsoxys(data, i) {
    var isoxys = new Isoxys(window.capsuleWallet.net, data.type, true);
    return new Promise((resolve, reject) => {
      switch (data.subType) {
        // Mnemonic
        case 'mnemonic':
          return isoxys.setAccountByMnemonic(
            data.asset.mnemonic,
            data.asset.password,
            DEFAULT_HD_PATH,
            i,
            window.capsuleWallet.getPassphrase.open,
            function (er, re) {
              if (er) return reject(er);
              return resolve(isoxys);
            });
        // Keystore
        case 'keystore':
          return isoxys.setAccountByKeystore(
            data.asset.keystore,
            data.asset.password,
            window.capsuleWallet.getPassphrase.open,
            function (er, re) {
              if (er) return reject(er);
              return resolve(isoxys);
            });
        // Private key
        case 'private-key':
          return isoxys.setAccountByPrivatekey(
            data.asset.privateKey,
            window.capsuleWallet.getPassphrase.open,
            function (er, re) {
              if (er) return reject(er);
              return resolve(isoxys);
            });
        // Error
        default:
          return reject(ERROR);
      }
    });
  }

  static getAddressByLedger(data, limit, page) {
    var ledger = new Ledger(window.capsuleWallet.net, data.type, true);
    return new Promise((resolve, reject) => {
      switch (data.subType) {
        // Ledger Nano S
        case 'ledger-nano-s':
          return ledger.getAccountsByLedgerNanoS(
            DEFAULT_HD_PATH,
            limit,
            page,
            function (er, re) {
              if (er || re.length <= 0) return reject(ERROR);
              return resolve(re);
            });
        // Error
        default:
          return reject(ERROR);
      }
    });
  }

  static setAddressByLedger(data, i) {
    var ledger = new Ledger(window.capsuleWallet.net, data.type, true);
    return new Promise((resolve, reject) => {
      switch (data.subType) {
        // Ledger Nano S
        case 'ledger-nano-s':
          return ledger.setAccountByLedgerNanoS(
            DEFAULT_HD_PATH,
            i,
            function (er, re) {
              if (er) return reject(er);
              return resolve(ledger);
            });
        // Error
        default:
          return reject(ERROR);
      }
    });
  }

  static getAddressByTrezor(data, limit, page) {
    var trezor = new Trezor(window.capsuleWallet.net, data.type, true);
    return new Promise((resolve, reject) => {
      switch (data.subType) {
        // Trezor One
        case 'trezor-one':
          return trezor.getAccountsByTrezorOne(
            DEFAULT_HD_PATH,
            limit,
            page,
            function (er, re) {
              if (er || re.length < 0) return reject(ERROR);
              return resolve(re);
            });
        // Error
        default:
          return reject(ERROR);
      }
    });
  }

  static setAddressByTrezor(data, i) {
    var trezor = new Trezor(window.capsuleWallet.net, data.type, true);
    return new Promise((resolve, reject) => {
      switch (data.subType) {
        // Trezor One
        case 'trezor-one':
          return trezor.setAccountByTrezorOne(
            DEFAULT_HD_PATH,
            i,
            function (er, re) {
              if (er) return reject(er);
              return resolve(trezor);
            });
        // Error
        default:
          return reject(ERROR);
      }
    });
  }
}

export default ConfirmAddressHelper;