class SessionStorage {

  static get(key) {
    if (!key) return null;
    return JSON.parse(window.sessionStorage.getItem(key));
  }

  static set(key, value) {
    if (!key || !value) return console.error('Key or value is null');
    return window.sessionStorage.setItem(key, JSON.stringify(value));
  }

  static remove(key) {
    if (!key) return console.error('Key is null');
    return window.sessionStorage.removeItem(key);
  }

  static removeAll() {
    return window.sessionStorage.clear();
  }
}

module.exports = SessionStorage;