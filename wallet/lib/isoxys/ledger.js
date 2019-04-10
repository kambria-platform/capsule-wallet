require("@babel/polyfill"); // To fix  error 'regeneratorRuntime is not defined'

var Eth = require('@ledgerhq/hw-app-eth').default;
var TransportU2F = require('@ledgerhq/hw-transport-u2f').default;
var util = require('../util');
const error = require('../constant/error');
const _default = require('./defaultConst');

/**
 * Hardwallet type
 */
var Ledger = function () { }

Ledger.getAddress = function (dpath, callback) {
  dpath = dpath || util.addDPath(_default.ETH_DERIVATION_PATH, _default.ACCOUNT_INDEX);
  Ledger.getTransport(function (er, transport) {
    if (er) return callback(er, null);
    if (!transport) return callback(error.UNSUPPORT_U2F, null);

    var eth = new Eth(transport);
    eth.getAddress(dpath, false, false).then(re => {
      if (!re || !re.address) return callback(error.CANNOT_CONNECT_HARDWARE, null);
      return callback(null, re.address);
    }).catch(er => {
      return callback(er, null);
    }).finally(() => {
      Ledger.closeTransport(transport);
    });
  });
}

Ledger.signTransaction = function (dpath, rawTx, callback) {
  dpath = dpath || util.addDPath(_default.ETH_DERIVATION_PATH, _default.ACCOUNT_INDEX);
  if (!rawTx) return callback(error.INVALID_TX, null);
  Ledger.getTransport(function (er, transport) {
    if (er) return callback(er, null);
    if (!transport) return callback(error.UNSUPPORT_U2F, null);

    var eth = new Eth(transport);
    eth.signTransaction(dpath, rawTx).then(re => {
      if (!re) return callback(error.CANNOT_CONNECT_HARDWARE, null);
      return callback(null, re);
    }).catch(er => {
      return callback(er, null);
    }).finally(() => {
      Ledger.closeTransport(transport);
    });
  });
}

Ledger.getTransport = function (callback) {
  TransportU2F.isSupported().then(re => {
    if (!re) return callback(error.UNSUPPORT_U2F, null);
    return TransportU2F.create().then(transport => {
      return callback(null, transport);
    }).catch(er => {
      return callback(er, null);
    });
  }).catch(er => {
    return callback(er, null);
  });
}

Ledger.closeTransport = function (transport) {
  return transport.close();
}

module.exports = Ledger;