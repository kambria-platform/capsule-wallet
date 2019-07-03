var { Metamask, Ledger, Trezor, Isoxys } = require('capsule-core-js');
var StateMaintainer = require('./stateMaintainer');

const ERROR = 'Invalid state of finite state machine';

class Web3Factory {
  constructor(restriedNetwork, pageRefreshing) {
    this.restriedNetwork = restriedNetwork;
    this.pageRefreshing = pageRefreshing;
    this.SM = new StateMaintainer();

    if (!this.pageRefreshing) this.SM.clearState();
  }

  isSessionMaintained = (callback) => {
    if (!this.pageRefreshing) return callback(null);
    return this.SM.getState(callback);
  }

  clearSession = (all) => {
    this.SM.clearState(all);
  }

  generate = (fmState, callback) => {
    let _callback = (er, provider) => {
      if (er) return callback(er, null);
      if (this.pageRefreshing && fmState.step === 'Success') {
        // Not support Hybridwallet and Trezor yet
        if (fmState.type !== 'hybridwallet') this.SM.setState(fmState);
      }
      return callback(null, provider);
    }

    switch (fmState.wallet) {

      // Metamask
      case 'metamask':
        let metamask = new Metamask(window.capsuleWallet.networkId, fmState.type, this.restriedNetwork);
        return metamask.setAccountByMetamask((er, re) => {
          if (er) return _callback(er, null);
          return _callback(null, metamask);
        });

      // Ledger
      case 'ledger':
        let ledger = new Ledger(window.capsuleWallet.networkId, fmState.type, this.restriedNetwork);
        switch (fmState.model) {
          case 'ledger-nano-s':
            return ledger.setAccountByLedgerNanoS(fmState.dpath, fmState.index, (er, re) => {
              if (er) return _callback(er, null);
              return _callback(null, ledger);
            });
          default:
            return _callback(ERROR, null);
        }

      // Trezor
      case 'trezor':
        let trezor = new Trezor(window.capsuleWallet.networkId, fmState.type, this.restriedNetwork);
        switch (fmState.model) {
          case 'trezor-one':
            return trezor.setAccountByTrezorOne(fmState.dpath, fmState.index, (er, re) => {
              if (er) return _callback(er, null);
              return _callback(null, trezor);
            });
          default:
            return _callback(ERROR, null);
        }

      // MyEtherWallet
      case 'mew':
        return _callback(null, fmState.provider);

      // Marrella
      case 'marrella':
        return _callback(null, fmState.provider);

      // Isoxys
      case 'isoxys':
        let isoxys = new Isoxys(window.capsuleWallet.networkId, fmState.type, this.restriedNetwork);
        switch (fmState.model) {
          case 'mnemonic':
            return isoxys.setAccountByMnemonic(
              fmState.asset.mnemonic,
              fmState.asset.password,
              fmState.dpath,
              fmState.index,
              window.capsuleWallet.getPassphrase.open,
              (er, re) => {
                if (er) return _callback(er, null);
                return _callback(null, isoxys);
              });
          case 'keystore':
            return isoxys.setAccountByKeystore(
              fmState.asset.keystore,
              fmState.asset.password,
              window.capsuleWallet.getPassphrase.open,
              (er, re) => {
                if (er) return _callback(er, null);
                return _callback(null, isoxys);
              });
          case 'private-key':
            return isoxys.setAccountByPrivatekey(
              fmState.asset.privateKey,
              window.capsuleWallet.getPassphrase.open,
              (er, re) => {
                if (er) return _callback(er, null);
                return _callback(null, isoxys);
              });
          default:
            return _callback(ERROR, null);
        }

      // Default
      default:
        return _callback(ERROR, null);
    }
  }

  regenerate = (fmState, callback) => {
    switch (fmState.wallet) {

      // Metamask
      case 'metamask':
        let metamask = new Metamask(window.capsuleWallet.networkId, fmState.type, this.restriedNetwork);
        return metamask.setAccountByMetamask((er, re) => {
          if (er) return callback(er, null);
          return callback(null, metamask);
        });

      // Ledger
      case 'ledger':
        let ledger = new Ledger(window.capsuleWallet.networkId, fmState.type, this.restriedNetwork);
        switch (fmState.model) {
          case 'ledger-nano-s':
            return ledger.setAccountByLedgerNanoS(fmState.dpath, fmState.index, (er, re) => {
              if (er) return callback(er, null);
              return callback(null, ledger);
            });
          default:
            return callback(ERROR, null);
        }

      // Trezor
      case 'trezor':
        let trezor = new Trezor(window.capsuleWallet.networkId, fmState.type, this.restriedNetwork);
        switch (fmState.model) {
          case 'trezor-one':
            return trezor.setAccountByTrezorOne(fmState.dpath, fmState.index, (er, re) => {
              if (er) return callback(er, null);
              return callback(null, trezor);
            });
          default:
            return callback(ERROR, null);
        }

      // Isoxys
      case 'isoxys':
        let isoxys = new Isoxys(window.capsuleWallet.networkId, fmState.type, this.restriedNetwork);
        let accOpts = { getPassphrase: window.capsuleWallet.getPassphrase.open };
        return isoxys.setWallet(accOpts, (er, re) => {
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