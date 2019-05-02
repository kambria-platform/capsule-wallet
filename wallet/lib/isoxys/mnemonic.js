var bip39 = require('bip39');
var HDKey = require('ethereumjs-wallet/hdkey');
var util = require('../util');
const _default = require('../constant/default');

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
  dpath = util.addDPath(dpath, index);
  var child = hdkey.derivePath(dpath);
  var addr = child.getWallet().getAddress();
  return util.padHex(addr.toString('hex'));
}

Mnemonic.hdkeyToAccount = function (hdkey, dpath, index) {
  dpath = dpath || _default.ETH_DERIVATION_PATH;
  dpath = util.addDPath(dpath, index);
  var account = hdkey.derivePath(dpath);
  var priv = account.getWallet().getPrivateKey();
  var addr = account.getWallet().getAddress();
  return { address: util.padHex(addr.toString('hex')), privateKey: priv.toString('hex') }
}

module.exports = Mnemonic;