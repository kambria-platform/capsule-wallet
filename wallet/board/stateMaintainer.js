var { ADDRESS } = require('../lib/provider/store');

const EVENT = {
  GET_DATA: 'GET_DATA',
  CLEAR_DATA: 'CLEAR_DATA',
}

class StateMaintainer {
  constructor() {
    this.maintainer = window.sessionStorage;
    this.porter = window.localStorage;

    // Public functions
    this.getState = this.getState.bind(this);
    this.setState = this.setState.bind(this);
    this.clearState = this.clearState.bind(this);
    // Internal functions
    this._clearState = this._clearState.bind(this);
    this._shareState = this._shareState.bind(this);
    this._handleEvent = this._handleEvent.bind(this);
    this._emitEvent = this._emitEvent.bind(this);

    // Setup listener
    if (window.addEventListener) {
      // Modern browser
      window.addEventListener('storage', this._handleEvent, false);
    } else {
      // IE8 and lower
      window.attachEvent('onstorage', this._handleEvent);
    };

    // Ask other tabs for session storage (this is ONLY to trigger event)
    if (!this.getState()) this._emitEvent(EVENT.GET_DATA);
  }

  getState() {
    return JSON.parse(this.maintainer.getItem(ADDRESS.MAINTAINER));
  }

  setState(value) {
    let state = JSON.parse(JSON.stringify(value));
    delete state.step;
    delete state.asset;
    this.maintainer.setItem(ADDRESS.MAINTAINER, JSON.stringify(state));
  }

  clearState() {
    this._clearState();
    this._emitEvent(EVENT.CLEAR_DATA);
  }

  _clearState() {
    this.maintainer.removeItem(ADDRESS.MAINTAINER);
    this.maintainer.removeItem(ADDRESS.PROVIDER);
    this.maintainer.removeItem(ADDRESS.CACHE);
  }

  _shareState() {
    let data = {};
    data[ADDRESS.MAINTAINER] = this.maintainer.getItem(ADDRESS.MAINTAINER);
    data[ADDRESS.PROVIDER] = this.maintainer.getItem(ADDRESS.PROVIDER);
    data[ADDRESS.CACHE] = this.maintainer.getItem(ADDRESS.CACHE);
    this.porter.setItem(ADDRESS.PORTER, JSON.stringify(data));
    this.porter.removeItem(ADDRESS.PORTER);
  }

  _handleEvent(event) {
    // I need data
    if (event.key == ADDRESS.EVENT && event.newValue == EVENT.GET_DATA) this._shareState();
    // We clear data
    if (event.key == ADDRESS.EVENT && event.newValue == EVENT.CLEAR_DATA) this._clearState();
    // I will send you data
    if (event.key == ADDRESS.PORTER) {
      let data = JSON.parse(event.newValue);
      for (var key in data) {
        this.maintainer.setItem(key, data[key]);
      }
    }
  }

  _emitEvent(event) {
    this.porter.setItem(ADDRESS.EVENT, event);
    this.porter.removeItem(ADDRESS.EVENT, event);
  }
}

module.exports = StateMaintainer;
