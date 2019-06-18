var { Metamask, Ledger, Trezor, Isoxys } = require('capsule-core-js');
var StateMaintainer = require('./stateMaintainer');

var ERROR = 'Invalid state';

class Web3Factory {
  constructor(restriedNetwork, pageRefreshing) {
    this.restriedNetwork = restriedNetwork;
    this.pageRefreshing = pageRefreshing;

    this.SM = new StateMaintainer();

    this.isSessionMaintained = this.isSessionMaintained.bind(this);
    this.clearSession = this.clearSession.bind(this);
    this.generate = this.generate.bind(this);
    this.regenerate = this.regenerate.bind(this);

    if (!this.pageRefreshing) this.SM.clearState();
  }

  isSessionMaintained(callback) {
    if (!this.pageRefreshing) return callback(null);
    return this.SM.getState(callback);
  }

  clearSession(all) {
    this.SM.clearState(all);
  }

  generate(state, callback) {
    let self = this;
    let _callback = function (er, provider) {
      if (er) return callback(er, null);
      if (self.pageRefreshing && state.step === 'Success') {
        // Not support Hybridwallet and Trezor yet
        if (state.type !== 'hybridwallet') self.SM.setState(state);
      }
      return callback(null, provider);
    }

    switch (state.wallet) {

      // Metamask
      case 'metamask':
        let metamask = new Metamask(window.capsuleWallet.networkId, state.type, this.restriedNetwork);
        return metamask.setAccountByMetamask(function (er, re) {
          if (er) return _callback(er, null);
          return _callback(null, metamask);
        });

      // Ledger
      case 'ledger':
        let ledger = new Ledger(window.capsuleWallet.networkId, state.type, this.restriedNetwork);
        switch (state.model) {
          case 'ledger-nano-s':
            return ledger.setAccountByLedgerNanoS(state.dpath, state.index, function (er, re) {
              if (er) return _callback(er, null);
              return _callback(null, ledger);
            });
          default:
            return _callback(ERROR, null);
        }

      // Trezor
      case 'trezor':
        let trezor = new Trezor(window.capsuleWallet.networkId, state.type, this.restriedNetwork);
        switch (state.model) {
          case 'trezor-one':
            return trezor.setAccountByTrezorOne(state.dpath, state.index, function (er, re) {
              if (er) return _callback(er, null);
              return _callback(null, trezor);
            });
          default:
            return _callback(ERROR, null);
        }

      // MyEtherWallet
      case 'mew':
        return _callback(null, state.provider);

      // Marrella
      case 'marrella':
        return _callback(null, state.provider);

      // Isoxys
      case 'isoxys':
        let isoxys = new Isoxys(window.capsuleWallet.networkId, state.type, this.restriedNetwork);
        switch (state.model) {
          case 'mnemonic':
            return isoxys.setAccountByMnemonic(
              state.asset.mnemonic,
              state.asset.password,
              state.dpath,
              state.index,
              window.capsuleWallet.getPassphrase.open,
              function (er, re) {
                if (er) return _callback(er, null);
                return _callback(null, isoxys);
              });
          case 'keystore':
            return isoxys.setAccountByKeystore(
              state.asset.keystore,
              state.asset.password,
              window.capsuleWallet.getPassphrase.open,
              function (er, re) {
                if (er) return _callback(er, null);
                return _callback(null, isoxys);
              });
          case 'private-key':
            return isoxys.setAccountByPrivatekey(
              state.asset.privateKey,
              window.capsuleWallet.getPassphrase.open,
              function (er, re) {
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

  regenerate(state, callback) {
    switch (state.wallet) {

      // Metamask
      case 'metamask':
        let metamask = new Metamask(window.capsuleWallet.networkId, state.type, this.restriedNetwork);
        return metamask.setAccountByMetamask(function (er, re) {
          if (er) return callback(er, null);
          return callback(null, metamask);
        });

      // Ledger
      case 'ledger':
        let ledger = new Ledger(window.capsuleWallet.networkId, state.type, this.restriedNetwork);
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
        let trezor = new Trezor(window.capsuleWallet.networkId, state.type, this.restriedNetwork);
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
        let isoxys = new Isoxys(window.capsuleWallet.networkId, state.type, this.restriedNetwork);
        let accOpts = { getPassphrase: window.capsuleWallet.getPassphrase.open };
        return isoxys.setWallet(accOpts, function (er, re) {
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