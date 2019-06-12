class LocalStorage {

  static get(key) {
    if (!key) return null;
    return JSON.parse(window.localStorage.getItem(key));
  }

  static set(key, value) {
    if (!key || !value) return console.error('Key or value is null');
    return window.localStorage.setItem(key, JSON.stringify(value));
  }

  static remove(key) {
    if (!key) return console.error('Key is null');
    return window.localStorage.removeItem(key);
  }

  static removeAll() {
    return window.localStorage.clear();
  }
}

module.exports = LocalStorage;