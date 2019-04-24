var ethTx = require('ethereumjs-tx');

var Util = function () { }

Util.chainCode = function (net) {
  net = net.toString().toLowerCase();
  switch (net) {
    case '1':
      return 1;
    case 'mainnet':
      return 1;
    case '3':
      return 3;
    case 'ropsten':
      return 3;
    case '42':
      return 42;
    case 'kovan':
      return 42;
    case '4':
      return 4;
    case 'rinkeby':
      return 4;
    default:
      return null;
  }
}

Util.padHex = function (hex) {
  if (!hex) return null;
  if (Buffer.isBuffer(hex)) hex = hex.toString('hex');
  if (typeof hex !== 'string') return null;

  var pattern = /(^0x)/gi;
  if (pattern.test(hex)) {
    return hex;
  } else {
    return '0x' + hex;
  }
}

Util.unpadHex = function (hex) {
  if (!hex) return null;
  if (Buffer.isBuffer(hex)) hex = hex.toString('hex');
  if (typeof hex !== 'string') return null;

  var pattern = /(^0x)/gi;
  if (pattern.test(hex)) {
    return hex.replace('0x', '');
  } else {
    return hex;
  }
}

Util.genRawTx = function (txParams) {
  var tx = new ethTx(txParams);
  tx.raw[6] = Buffer.from([tx._chainId]); // v
  tx.raw[7] = Buffer.from([]); // r
  tx.raw[8] = Buffer.from([]); // s
  return { raw: tx, hex: Util.padHex(tx.serialize().toString('hex')) };
}

Util.signRawTx = function (txParams, priv) {
  var rawTx = Util.genRawTx(txParams).raw;
  rawTx.sign(Buffer.from(priv, 'hex'));
  var signedTx = Util.padHex(rawTx.serialize().toString('hex'));
  return signedTx;
}

Util.genSignedTx = function (txParams) {
  var tx = new ethTx(txParams);
  return Util.padHex(tx.serialize().toString('hex'));
}

Util.addDPath = function (dpath, index) {
  if (!dpath || typeof dpath !== 'string') return null;
  dpath = dpath.trim();
  index = index || 0;
  index = index.toString();
  index = index.trim();

  var _dpath = dpath.split('');
  if (_dpath[_dpath.length - 1] === '/') {
    _dpath.pop();
    dpath = _dpath.join('');
  } else {
    dpath = _dpath.join('');
  }
  var _index = index.split('');
  if (_index[0] === '/') {
    _index.shift();
    index = _index.join('');
  } else {
    index = _index.join('');
  }

  return dpath + '/' + index;
}

module.exports = Util;