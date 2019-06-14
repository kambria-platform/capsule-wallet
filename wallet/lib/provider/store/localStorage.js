var ADDRESS = require('./address');

class LocalStorage {

  static get() {
    return JSON.parse(window.localStorage.getItem(ADDRESS.PROVIDER));
  }

  static set(value) {
    if (!value) return console.error('Key or value is null');
    return window.localStorage.setItem(ADDRESS.PROVIDER, JSON.stringify(value));
  }

  static remove() {
    return window.localStorage.removeItem(ADDRESS.PROVIDER);
  }
}

module.exports = LocalStorage;