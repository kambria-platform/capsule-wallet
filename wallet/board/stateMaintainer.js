const ADDRESS = require('./address');

const EVENT = {
  GET_DATA: 'GET_DATA',
  CLEAR_DATA: 'CLEAR_DATA',
}

class StateMaintainer {
  constructor() {
    this.maintainer = window.sessionStorage;
    this.porter = window.localStorage;

    // Setup listener
    window.addEventListener('storage', this._handleEvent, false);
  }

  /**
   * Public functions
   */

  getState = (callback) => {
    let data = JSON.parse(this.maintainer.getItem(ADDRESS.MAINTAINER));
    if (data) return callback(data);
    this._emitEvent(EVENT.GET_DATA);
    setTimeout(() => {
      data = JSON.parse(this.maintainer.getItem(ADDRESS.MAINTAINER));
      return callback(data);
    }, 1000);
  }

  setState = (value) => {
    let state = JSON.parse(JSON.stringify(value));
    delete state.step;
    delete state.asset;
    this.maintainer.setItem(ADDRESS.MAINTAINER, JSON.stringify(state));
  }

  clearState = (all) => {
    this._clearState(all);
    this._emitEvent(EVENT.CLEAR_DATA);
  }

  /**
   * Internal functions
   */

  _clearState = (all) => {
    if (all) {
      this.maintainer.removeItem(ADDRESS.MAINTAINER);
      this.maintainer.removeItem(ADDRESS.PROVIDER);
      this.maintainer.removeItem(ADDRESS.CACHE);
    }
    else {
      this.maintainer.removeItem(ADDRESS.MAINTAINER);
    }
  }

  _shareState = () => {
    let data = {};
    let MAINTAINER = this.maintainer.getItem(ADDRESS.MAINTAINER);
    let PROVIDER = this.maintainer.getItem(ADDRESS.PROVIDER);
    let CACHE = this.maintainer.getItem(ADDRESS.CACHE);
    if (MAINTAINER) data[ADDRESS.MAINTAINER] = MAINTAINER;
    if (PROVIDER) data[ADDRESS.PROVIDER] = PROVIDER;
    if (CACHE) data[ADDRESS.CACHE] = CACHE;
    this.porter.setItem(ADDRESS.PORTER, JSON.stringify(data));
    this.porter.removeItem(ADDRESS.PORTER);
  }

  _handleEvent = (event) => {
    // I need data
    if (event.key == ADDRESS.EVENT && event.newValue == EVENT.GET_DATA)
      this._shareState();
    // We clear data
    if (event.key == ADDRESS.EVENT && event.newValue == EVENT.CLEAR_DATA)
      this._clearState();
    // I will send you data
    if (event.key == ADDRESS.PORTER) {
      let data = JSON.parse(event.newValue);
      for (let key in data) {
        this.maintainer.setItem(key, data[key]);
      }
    }
  }

  _emitEvent = (event) => {
    this.porter.setItem(ADDRESS.EVENT, event);
    this.porter.removeItem(ADDRESS.EVENT);
  }
}

module.exports = StateMaintainer;
