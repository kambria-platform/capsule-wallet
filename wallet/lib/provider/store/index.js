var localStorage = require('./localStorage');
var sessionStorage = require('./sessionStorage'); // Recommend to use
var cache = require('./cache');

module.exports = {
  localStorage: localStorage,
  sessionStorage: sessionStorage,
  cache: cache
}