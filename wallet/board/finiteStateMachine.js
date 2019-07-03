/**
 * Defined states
 */
const STATE = ['Idle', 'SelectWallet', 'InputAsset', 'EstablishConnection', 'ConnectDevice', 'ConfirmAddress', 'Error', 'Success'];
const MACHINE = {
  Idle: {
    currentState: 'Idle',
    nextState: [
      { step: 'SelectWallet', pattern: null }
    ]
  },
  SelectWallet: {
    currentState: 'SelectWallet',
    nextState: [
      { step: 'InputAsset', pattern: { type: 'softwallet', wallet: 'isoxys' } },
      { step: 'ConnectDevice', pattern: { type: 'hardwallet' } },
      { step: 'EstablishConnection', pattern: { type: 'hybridwallet' } },
      { step: 'Success', pattern: { type: 'softwallet', wallet: 'metamask', model: 'metamask' } },
      { step: 'Error', pattern: { wallet: '*', type: '*' } }
    ]
  },
  InputAsset: {
    currentState: 'InputAsset',
    nextState: [
      { step: 'ConfirmAddress', pattern: { model: 'mnemonic' } },
      { step: 'ConfirmAddress', pattern: { model: 'keystore' } },
      { step: 'ConfirmAddress', pattern: { model: 'private-key' } },
      { step: 'Error', pattern: { model: '*' } },
    ]
  },
  EstablishConnection: {
    currentState: 'EstablishConnection',
    nextState: [
      { step: 'Success', pattern: { provider: true } },
      { step: 'Error', pattern: { provider: false } },
    ]
  },
  ConnectDevice: {
    currentState: 'ConnectDevice',
    nextState: [
      { step: 'ConfirmAddress', pattern: { wallet: 'ledger', model: 'ledger-nano-s' } },
      { step: 'ConfirmAddress', pattern: { wallet: 'trezor', model: 'trezor-one' } },
      { step: 'Error', pattern: { model: '*' } },
    ]
  },
  ConfirmAddress: {
    currentState: 'ConfirmAddress',
    nextState: [
      { step: 'Success', pattern: { dpath: true } },
      { step: 'Error', pattern: { dpath: false } },
    ]
  },
  Error: {
    currentState: 'Error',
    nextState: [
      { step: 'Idle', pattern: null }
    ]
  },
  Success: {
    currentState: 'Success',
    nextState: [
      { step: 'Idle', pattern: null }
    ]
  }
}


/**
 * Class
 */
const DEFAULT = {
  step: STATE[0],
  type: null, // softwallet, hardwallet, hybridwallet
  wallet: null, // metamask, isoxys, ledger, trezor, mew
  model: null, // mnemonic, keystore, private-key, ledger-nano-s, trezor-one, mew
  dpath: null,
  index: null,
  asset: null
}

class FiniteStateMachine {

  constructor() {
    this.data = DEFAULT;
    this.index = 0;
    this.history = [this.data];
  }

  reset = () => {
    this.data = DEFAULT;
    this.index = 0;
    for (let i = 0; i < this.history.length; i++) {
      delete this.history[i];
    }
    this.history.length = 0;
    this.history = [this.data];
  }

  match = (pattern, data) => {
    if (data == null) throw new Error('Finite State Machine was broken');
    if (pattern == null) return true;
    let keys = Object.keys(pattern);
    for (let key of keys) {
      if (typeof pattern[key] === 'boolean') {
        if (pattern[key] !== '*' && pattern[key] !== Boolean(data[key])) return false;
      }
      else if (pattern[key] !== '*' && pattern[key] !== data[key]) return false;
    }
    return true;
  }

  back = () => {
    if (this.index > 0) {
      delete this.history[this.history.length - 1];
      this.history.length = this.index;
      this.index = this.index - 1;
      this.data = this.history[this.index];
    }
    return this.data;
  }

  next = (data) => {
    this.data = { ...this.data, ...data }

    this.history.push(this.data);
    this.index = this.index + 1;

    let currentState = MACHINE[this.data.step];
    for (let nextState of currentState.nextState) {
      let ok = this.match(nextState.pattern, this.data);
      if (ok) {
        this.data.step = nextState.step;
        break;
      }
    }
    return this.data;
  }
}

export default FiniteStateMachine;