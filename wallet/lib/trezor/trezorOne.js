var TrezorConnect = require('trezor-connect').default;
var util = require('../util');
var cache = require('../cache');
const error = require('../constant/error');
const _default = require('../constant/default');

// Register trezor manifest
TrezorConnect.manifest({
  email: 'phan.son.tu.1994@gmail.com',
  appUrl: 'https://github.com/sontuphan/capsule-wallet'
});

/**
 * Hardwallet type
 */
var TrezorOne = function () { }

TrezorOne.getAddress = function (dpath, callback) {
  // Generate options
  let options = null;
  let flag = false; // If true, querying by bundle. If false, querying single address.

  if (typeof dpath === 'object') {
    if (dpath.length > 1) flag = true;
    else flag = false;

    let bundle = dpath.map(item => {
      return { path: item, showOnTrezor: false }
    });
    options = { bundle: bundle }
  }
  else {
    flag = false;
    dpath = dpath || util.addDPath(_default.ETH_DERIVATION_PATH, _default.ACCOUNT_INDEX);
    if (cache.get(dpath)) return callback(null, cache.get(dpath));
    options = { path: dpath, showOnTrezor: false }
  }
  // Query addresses
  TrezorConnect.ethereumGetAddress(options).then(re => {
    if (!re.success) return callback(error.CANNOT_CONNECT_HARDWARE, null);

    if (flag) return callback(null, re.payload.map(item => {
      cache.set(item.serializedPath, item.address, 5000);
      return item.address
    }));

    cache.set(re.payload.serializedPath, re.payload.address, 5000);
    return callback(null, re.payload.address);
  }).catch(er => {
    return callback(er, null);
  });
}

TrezorOne.signTransaction = function (dpath, txParams, callback) {
  dpath = dpath || util.addDPath(_default.ETH_DERIVATION_PATH, _default.ACCOUNT_INDEX);
  if (!txParams) return callback(error.INVALID_TX, null);

  txParams.gasLimit = txParams.gas;
  delete txParams["gas"];
  TrezorConnect.ethereumSignTransaction({
    path: dpath,
    transaction: txParams
  }).then(re => {
    if (!re.success) return callback(error.CANNOT_SIGN_TX, null);
    re.payload.r = util.unpadHex(re.payload.r);
    re.payload.s = util.unpadHex(re.payload.s);
    re.payload.v = util.unpadHex(re.payload.v);
    return callback(null, re.payload);
  }).catch(er => {
    return callback(er, null);
  });
}

module.exports = TrezorOne;