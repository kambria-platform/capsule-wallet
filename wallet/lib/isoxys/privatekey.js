var ethUtil = require('ethereumjs-util');
var util = require('../util');

/**
 * Softwallet type
 */
var Privatekey = function () { }

Privatekey.privatekeyToAccount = function (priv) {
  if (!priv) return null;
  if (typeof priv === 'string') priv = new Buffer(priv, 'hex');
  else if (!Buffer.isBuffer(priv)) return null;
  if (!ethUtil.isValidPrivate(priv)) return null;
  var addr = ethUtil.privateToAddress(priv);
  return { address: util.padHex(addr.toString('hex')), privateKey: priv.toString('hex') }
}

module.exports = Privatekey;