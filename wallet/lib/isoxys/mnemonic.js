var ethUtil = require('ethereumjs-util');
var bip39 = require('bip39');
var HDKey = require('hdkey');
var util = require('../util');
const _default = require('./defaultConst');

/**
 * Softwallet type
 */
var Mnemonic = function () { }

Mnemonic.mnemonicToSeed = function (mnemonic, password, callback) {
  bip39.mnemonicToSeed(mnemonic.trim(), password).then(seed => {
    return callback(seed);
  }).catch(er => {
    console.error(er);
    return callback(null);
  });
}

Mnemonic.seedToHDKey = function (seed) {
  if (!Buffer.isBuffer(seed)) {
    console.error('Seed must be type of buffer');
    return null;
  }
  return HDKey.fromMasterSeed(seed);
}

Mnemonic.hdkeyToAddress = function (hdkey, dpath, index) {
  dpath = dpath || _default.ETH_DERIVATION_PATH;
  dpath = util.addDPath(dpath, index);;
  var child = hdkey.derive(dpath);
  if (child.publicKey) var addr = ethUtil.pubToAddress(child.publicKey, true /* multi pub-format */);
  else if (child.publicKey) var addr = ethUtil.privateToAddress(child.publicKey);
  else return null;
  return util.padHex(addr.toString('hex'));
}

Mnemonic.hdkeyToAccount = function (hdkey, dpath, index) {
  dpath = dpath || _default.ETH_DERIVATION_PATH;
  dpath = util.addDPath(dpath, index);;
  var child = hdkey.derive(dpath);
  var priv = child.privateKey;
  var addr = ethUtil.privateToAddress(priv);
  return { address: util.padHex(addr.toString('hex')), privateKey: priv.toString('hex') }
}

module.exports = Mnemonic;