class LocalStorage {
  constructor() {
    this.store = window.localStorage;
  }

  get(key) {
    if (!key) return this.store;
    return JSON.parse(this.store.getItem(key));
  }

  set(key, value) {
    if (!key || !value) return console.error('Key or value is null');
    return this.store.setItem(key, JSON.stringify(value));
  }

  remove(key) {
    if (!key) return console.error('Key is null');
    return this.store.removeItem(key);
  }

  removeAll() {
    return this.store.clear();
  }
}

module.exports = LocalStorage;