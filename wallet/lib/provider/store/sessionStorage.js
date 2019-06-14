var ADDRESS = require('./address');

class SessionStorage {

  static get() {
    return JSON.parse(window.sessionStorage.getItem(ADDRESS.PROVIDER));
  }

  static set(value) {
    if (!value) return console.error('Key or value is null');
    return window.sessionStorage.setItem(ADDRESS.PROVIDER, JSON.stringify(value));
  }

  static remove() {
    return window.sessionStorage.removeItem(ADDRESS.PROVIDER);
  }
}

module.exports = SessionStorage;