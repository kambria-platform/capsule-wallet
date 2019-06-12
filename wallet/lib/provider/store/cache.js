const prefix = 'CAPSULE-CACHE';

class Cache {

  static get(key) {
    if (!key) return null;
    let data = JSON.parse(window.sessionStorage.getItem(prefix)) || {};
    return data[key];
  }

  static set(key, value) {
    if (!key || !value) return console.error('Key or value is null');
    let data = JSON.parse(window.sessionStorage.getItem(prefix)) || {};
    data[key] = value;
    return window.sessionStorage.setItem(prefix, JSON.stringify(data));
  }

  static remove(key) {
    if (!key) return console.error('Key is null');
    let data = JSON.parse(window.sessionStorage.getItem(prefix)) || {};
    delete data[key];
    return window.sessionStorage.setItem(prefix, JSON.stringify(data));
  }

  static removeAll() {
    return window.sessionStorage.removeItem(prefix);
  }
}

module.exports = Cache;