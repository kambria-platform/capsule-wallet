var Isoxys = require('../../../lib/isoxys');
var Ledger = require('../../../lib/ledger');
var Trezor = require('../../../lib/trezor');

const ERROR = 'No address found';

class ConfirmAddressHelper {

  static getAddressByIsoxys(data, dpath, limit, page) {
    var isoxys = new Isoxys(window.capsuleWallet.net, data.type, true);
    return new Promise((resolve, reject) => {
      switch (data.model) {
        // Mnemonic
        case 'mnemonic':
          return isoxys.getAccountsByMnemonic(
            data.asset.mnemonic,
            data.asset.password,
            dpath,
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

  static getAddressByLedger(data, dpath, limit, page) {
    var ledger = new Ledger(window.capsuleWallet.net, data.type, true);
    return new Promise((resolve, reject) => {
      switch (data.model) {
        // Ledger Nano S
        case 'ledger-nano-s':
          return ledger.getAccountsByLedgerNanoS(
            dpath,
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

  static getAddressByTrezor(data, dpath, limit, page) {
    var trezor = new Trezor(window.capsuleWallet.net, data.type, true);
    return new Promise((resolve, reject) => {
      switch (data.model) {
        // Trezor One
        case 'trezor-one':
          return trezor.getAccountsByTrezorOne(
            dpath,
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
}

export default ConfirmAddressHelper;