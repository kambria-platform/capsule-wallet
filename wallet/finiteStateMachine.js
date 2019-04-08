/**
 * Defined states
 */
const STATE = ['Idle', 'SelectWallet', 'InputAsset', 'ConnectDevice', 'ConfirmAddress', 'Error', 'Success'];
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
      { step: 'InputAsset', pattern: { wallet: 'isoxys', type: 'softwallet' } },
      { step: 'ConnectDevice', pattern: { wallet: 'isoxys', type: 'hardwallet' } },
      { step: 'Success', pattern: { wallet: 'metamask', type: 'softwallet' } },
      { step: 'Error', pattern: { wallet: '*', type: '*' } }
    ]
  },
  InputAsset: {
    currentState: 'InputAsset',
    nextState: [
      { step: 'ConfirmAddress', pattern: { subType: 'mnemonic' } },
      { step: 'ConfirmAddress', pattern: { subType: 'keystore' } },
      { step: 'ConfirmAddress', pattern: { subType: 'private-key' } },
      { step: 'Error', pattern: { subType: '*' } },
    ]
  },
  ConnectDevice: {
    currentState: 'ConnectDevice',
    nextState: [
      { step: 'ConfirmAddress', pattern: { subType: 'ledger-nano-s' } },
    ]
  },
  ConfirmAddress: {
    currentState: 'ConfirmAddress',
    nextState: [
      { step: 'Success', pattern: { provider: true } },
      { step: 'Error', pattern: { provider: false } },
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
  wallet: null, // null, metamask, isoxys
  type: null, // softwallet, hardwallet
  subType: null, // null, mnemonic, keystore, ledger-nano-s, private-key
  provider: null,
  asset: null
}

class FiniteStateMachine {

  constructor() {
    this.data = DEFAULT;
    this.index = 0;
    this.history = [this.data];
  }

  reset() {
    this.data = DEFAULT;
    this.index = 0;
    for (let i = 0; i < this.history.length; i++) {
      delete this.history[i];
    }
    this.history.length = 0;
    this.history = [this.data];
  }

  match(pattern, data) {
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

  back() {
    if (this.index > 0) {
      delete this.history[this.history.length - 1];
      this.history.length = this.index;
      this.index = this.index - 1;
      this.data = this.history[this.index];
    }
  }

  next(data) {
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