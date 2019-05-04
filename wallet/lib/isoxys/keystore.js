var keythereum = require('keythereum');
var privatekey = require('./privatekey');

/**
 * Softwallet type
 */
var Keystore = function () { }

Keystore.recover = function (input, password, callback) {
  keythereum.recover(password, input, function (priv) {
    return callback(privatekey.privatekeyToAccount(priv));
  });
}

module.exports = Keystore;