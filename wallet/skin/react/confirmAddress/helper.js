var { Isoxys, Ledger, Trezor } = require('capsule-core-js');
var { NonWallet } = require('capsule-core-js');
var kam

const ERROR = 'Cannot load addresses';

class Helper {

  static getAddressByIsoxys(data, dpath, limit, page) {
    let isoxys = new Isoxys(window.capsuleWallet.networkId, data.type, true);
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
            (er, re) => {
              if (er || re.length <= 0) return reject(ERROR);
              return resolve(re);
            });
        // Keystore
        case 'keystore':
          return isoxys.getAccountByKeystore(
            data.asset.keystore,
            data.asset.password,
            (er, re) => {
              if (er || !re) return reject(ERROR);
              return resolve([re]);
            });
        // Private key
        case 'private-key':
          return isoxys.getAccountByPrivatekey(
            data.asset.privateKey,
            (er, re) => {
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
    let ledger = new Ledger(window.capsuleWallet.networkId, data.type, true);
    return new Promise((resolve, reject) => {
      switch (data.model) {
        // Ledger Nano S
        case 'ledger-nano-s':
          return ledger.getAccountsByLedgerNanoS(
            dpath,
            limit,
            page,
            (er, re) => {
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
    let trezor = new Trezor(window.capsuleWallet.networkId, data.type, true);
    return new Promise((resolve, reject) => {
      switch (data.model) {
        // Trezor One
        case 'trezor-one':
          return trezor.getAccountsByTrezorOne(
            dpath,
            limit,
            page,
            (er, re) => {
              if (er || re.length < 0) return reject(ERROR);
              return resolve(re);
            });
        // Error
        default:
          return reject(ERROR);
      }
    });
  }

  static getBalance(address) {
    return new Promise((resolve, reject) => {
      let nonWallet = new NonWallet(window.capsuleWallet.networkId);
      nonWallet.init((er, web3) => {
        if (er) return reject(er);

        web3.eth.getBalance(address, (er, re) => {
          if (er) return reject(er);
          return resolve(web3.fromWei(re.toString(), 'ether').slice(0, 6));
        });
      });
    });
  }
}

export default Helper;