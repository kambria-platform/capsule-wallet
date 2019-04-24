var Eth = require('@ledgerhq/hw-app-eth').default;
var TransportU2F = require('@ledgerhq/hw-transport-u2f').default;
var TransportWebUSB = require('@ledgerhq/hw-transport-webusb').default;
var util = require('../util');
const error = require('../constant/error');
const _default = require('../isoxys/defaultConst');

/**
 * Hardwallet type
 */
var LedgerNanoS = function () { }

LedgerNanoS.getAddress = function (dpath, callback) {
  dpath = dpath || util.addDPath(_default.ETH_DERIVATION_PATH, _default.ACCOUNT_INDEX);
  LedgerNanoS.getCommunication(function (er, eth) {
    if (er) return callback(er, null);

    eth.getAddress(dpath, false, false).then(re => {
      if (!re || !re.address) return callback(error.CANNOT_CONNECT_HARDWARE, null);
      return callback(null, re.address);
    }).catch(er => {
      return callback(er, null);
    });
  });
}

LedgerNanoS.signTransaction = function (dpath, rawTx, callback) {
  dpath = dpath || util.addDPath(_default.ETH_DERIVATION_PATH, _default.ACCOUNT_INDEX);
  if (!rawTx) return callback(error.INVALID_TX, null);
  LedgerNanoS.getCommunication(function (er, eth) {
    if (er) return callback(er, null);

    eth.signTransaction(dpath, rawTx).then(re => {
      if (!re) return callback(error.CANNOT_CONNECT_HARDWARE, null);
      return callback(null, re);
    }).catch(er => {
      return callback(er, null);
    });
  });
}

LedgerNanoS.getCommunication = function (callback) {
  if (LedgerNanoS.eth) return callback(null, LedgerNanoS.eth);

  LedgerNanoS.getTransport(function (er, transport) {
    if (er) return callback(er, null);

    LedgerNanoS.eth = new Eth(transport);
    return callback(null, LedgerNanoS.eth);
  });
}

LedgerNanoS.getTransport = function (callback) {
  let webusbSupported = false;
  let u2fSupported = false;

  TransportWebUSB.isSupported().then(re => {
    webusbSupported = re;
    return TransportU2F.isSupported()
  }).then(re => {
    u2fSupported = re;

    if (webusbSupported) return TransportWebUSB.create();
    if (u2fSupported) return TransportU2F.create();
    return callback(error.UNSUPPORT_U2F, null);
  }).then(transport => {
    return callback(null, transport);
  }).catch(er => {
    return callback(er, null);
  });
}

LedgerNanoS.closeTransport = function (transport) {
  return transport.close();
}

module.exports = LedgerNanoS;