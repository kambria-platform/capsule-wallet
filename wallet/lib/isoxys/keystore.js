var keythereum = require('keythereum');
var privatekey = require('./privatekey');

/**
 * Softwallet type
 */
var Keystore = function () { }

// Faster than two above
Keystore.recover = function (input, password) {
  var priv = keythereum.recover(password, input);
  return privatekey.privatekeyToAccount(priv);
}

module.exports = Keystore;