var Metamask = require('../lib/metamask');
var Ledger = require('../lib/ledger');
var Trezor = require('../lib/trezor');
var Isoxys = require('../lib/isoxys');

var ERROR = 'Invalid state';

class Web3Factory {
  constructor(supportedPageRefreshing) {
    this.supportedPageRefreshing = supportedPageRefreshing;
    this.store = window.sessionStorage;
  }

  isSessionMaintained() {
    return JSON.parse(this.store.getItem('CAPSULE-MAINTAINER'));
  }

  clearSession() {
    return this.store.clear();
  }

  generate(state, callback) {
    if (this.supportedPageRefreshing && state.step === 'Success') {
      // How support Hybridwallet and Trezor yet
      if (state.type !== 'hybridwallet') {
        let data = JSON.parse(JSON.stringify(state));
        delete data.step;
        delete data.asset;
        delete data.provider;
        this.store.setItem('CAPSULE-MAINTAINER', JSON.stringify(data));
      }
    }

    switch (state.wallet) {

      // Metamask
      case 'metamask':
        let metamask = new Metamask(window.capsuleWallet.net, state.type, true);
        return metamask.setAccountByMetamask(function (er, re) {
          if (er) return callback(er, null);
          return callback(null, metamask);
        });

      // Ledger
      case 'ledger':
        let ledger = new Ledger(window.capsuleWallet.net, state.type, true);
        switch (state.model) {
          case 'ledger-nano-s':
            return ledger.setAccountByLedgerNanoS(state.dpath, state.index, function (er, re) {
              if (er) return callback(er, null);
              return callback(null, ledger);
            });
          default:
            return callback(ERROR, null);
        }

      // Trezor
      case 'trezor':
        let trezor = new Trezor(window.capsuleWallet.net, state.type, true);
        switch (state.model) {
          case 'trezor-one':
            return trezor.setAccountByTrezorOne(state.dpath, state.index, function (er, re) {
              if (er) return callback(er, null);
              return callback(null, trezor);
            });
          default:
            return callback(ERROR, null);
        }

      // MyEtherWallet
      case 'mew':
        return callback(null, state.provider);

      // Marrella
      case 'marrella':
        return callback(null, state.provider);

      // Isoxys
      case 'isoxys':
        let isoxys = new Isoxys(window.capsuleWallet.net, state.type, true);
        switch (state.model) {
          case 'mnemonic':
            return isoxys.setAccountByMnemonic(
              state.asset.mnemonic,
              state.asset.password,
              state.dpath,
              state.index,
              window.capsuleWallet.getPassphrase.open,
              function (er, re) {
                if (er) return callback(er, null);
                return callback(null, isoxys);
              });
          case 'keystore':
            return isoxys.setAccountByKeystore(
              state.asset.keystore,
              state.asset.password,
              window.capsuleWallet.getPassphrase.open,
              function (er, re) {
                if (er) return callback(er, null);
                return callback(null, isoxys);
              });
          case 'private-key':
            return isoxys.setAccountByPrivatekey(
              state.asset.privateKey,
              window.capsuleWallet.getPassphrase.open,
              function (er, re) {
                if (er) return callback(er, null);
                return callback(null, isoxys);
              });
          default:
            return callback(ERROR, null);
        }

      // Default
      default:
        return callback(ERROR, null);
    }
  }

  regenerate(state, callback) {
    switch (state.wallet) {

      // Metamask
      case 'metamask':
        let metamask = new Metamask(window.capsuleWallet.net, state.type, true);
        return metamask.setAccountByMetamask(function (er, re) {
          if (er) return callback(er, null);
          return callback(null, metamask);
        });

      // Ledger
      case 'ledger':
        let ledger = new Ledger(window.capsuleWallet.net, state.type, true);
        switch (state.model) {
          case 'ledger-nano-s':
            return ledger.setAccountByLedgerNanoS(state.dpath, state.index, function (er, re) {
              if (er) return callback(er, null);
              return callback(null, ledger);
            });
          default:
            return callback(ERROR, null);
        }

      // Trezor
      case 'trezor':
        let trezor = new Trezor(window.capsuleWallet.net, state.type, true);
        switch (state.model) {
          case 'trezor-one':
            return trezor.setAccountByTrezorOne(state.dpath, state.index, function (er, re) {
              if (er) return callback(er, null);
              return callback(null, trezor);
            });
          default:
            return callback(ERROR, null);
        }

      // Isoxys
      case 'isoxys':
        let isoxys = new Isoxys(window.capsuleWallet.net, state.type, true);
        let accOpts = { getPassphrase: window.capsuleWallet.getPassphrase.open };
        isoxys.setWallet(accOpts, function (er, re) {
          if (er) return callback(er, null);
          return callback(null, isoxys);
        });

      // Default
      default:
        return callback(ERROR, null);
    }
  }
}

export default Web3Factory;