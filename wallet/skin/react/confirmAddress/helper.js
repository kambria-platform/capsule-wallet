var Isoxys = require('../../../lib/isoxys');

const DEFAULT_HD_PATH = "m/44'/60'/0'/0";
const ERROR = 'No address found';

class ConfirmAddressHelper {

  static getAddressByIsoxys(data, limit, page) {
    var isoxys = new Isoxys(data.net, data.type, true);
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
        // Ledger Nano S
        case 'ledger-nano-s':
          return isoxys.getAccountsByLedger(
            DEFAULT_HD_PATH,
            limit,
            page,
            function (er, re) {
              if (er || re.length <= 0) return reject(ERROR);
              return resolve(re);
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
    var isoxys = new Isoxys(data.net, data.type, true);
    return new Promise((resolve, reject) => {
      switch (data.subType) {
        // Mnemonic
        case 'mnemonic':
          return isoxys.setAccountByMnemonic(
            data.asset.mnemonic,
            data.asset.password,
            DEFAULT_HD_PATH,
            i,
            window.capsuleWallet.getPassphrase,
            function (er, re) {
              if (er) return reject(er);
              return resolve(isoxys);
            });
        // Keystore
        case 'keystore':
          return isoxys.setAccountByKeystore(
            data.asset.keystore,
            data.asset.password,
            window.capsuleWallet.getPassphrase,
            function (er, re) {
              if (er) return reject(er);
              return resolve(isoxys);
            });
        // Ledger Nano S
        case 'ledger-nano-s':
          return isoxys.setAccountByLedger(
            DEFAULT_HD_PATH,
            i,
            function (er, re) {
              if (er) return reject(er);
              return resolve(isoxys);
            });
        // Private key
        case 'private-key':
          return isoxys.setAccountByPrivatekey(
            data.asset.privateKey,
            window.capsuleWallet.getPassphrase,
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
}

export default ConfirmAddressHelper;