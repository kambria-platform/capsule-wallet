var capsuleCoreMemmory = require('capsule-core-js/dist/storage').sessionStorage;
var capsuleCoreCache = require('capsule-core-js/dist/storage').cache;
const ADDRESS = require('./address');
const EVENT = require('./event');


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
    this._emitEvent(EVENT.SET_DATA);
  }

  clearState = () => {
    this._clearState();
    this._emitEvent(EVENT.CLEAR_DATA);
  }

  /**
   * Internal functions
   */

  _clearState = () => {
    this.maintainer.removeItem(ADDRESS.MAINTAINER);
    try { window.capsuleWallet.provider.logout(); }
    catch (er) { console.error('User already logged out'); }
    finally { window.capsuleWallet.provider = null; }
  }

  _shareState = () => {
    let data = {};
    let MAINTAINER = this.maintainer.getItem(ADDRESS.MAINTAINER);
    let CAPSULE_JS_MEMORY = capsuleCoreMemmory.get();
    let CAPSULE_JS_CACHE = capsuleCoreCache.getAll();
    if (MAINTAINER) data[ADDRESS.MAINTAINER] = MAINTAINER;
    if (CAPSULE_JS_MEMORY) data[ADDRESS.CAPSULE_JS_MEMORY] = CAPSULE_JS_MEMORY;
    if (CAPSULE_JS_CACHE) data[ADDRESS.CAPSULE_JS_CACHE] = CAPSULE_JS_CACHE;
    this.porter.setItem(ADDRESS.PORTER, JSON.stringify(data));
    this.porter.removeItem(ADDRESS.PORTER);
  }

  _handleEvent = (event) => {
    // Some tags need data, we must share
    if (event.key == ADDRESS.EVENT && event.newValue == EVENT.GET_DATA)
      this._shareState();
    // We clear data
    if (event.key == ADDRESS.EVENT && event.newValue == EVENT.CLEAR_DATA)
      this._clearState();
    // I will send you data
    if (event.key == ADDRESS.PORTER) {
      let data = JSON.parse(event.newValue);
      for (let key in data) {
        if (key == ADDRESS.CAPSULE_JS_MEMORY) {
          capsuleCoreMemmory.set(data[key]);
        }
        if (key == ADDRESS.CAPSULE_JS_CACHE) {
          capsuleCoreCache.setAll(data[key]);
        }
        else {
          this.maintainer.setItem(key, data[key]);
        }
      }
    }
  }

  _emitEvent = (event) => {
    this.porter.setItem(ADDRESS.EVENT, event);
    this.porter.removeItem(ADDRESS.EVENT);
  }
}

module.exports = StateMaintainer;
