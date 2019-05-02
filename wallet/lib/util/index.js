var ethTx = require('ethereumjs-tx');
var HDKey = require('hdkey');
var ethUtil = require('ethereumjs-util');

var Util = function () { }

Util.chainCode = function (net, type) {
  // if (Buffer.isBuffer(net))
  net = net.toString().toLowerCase();
  switch (net) {
    case '1':
      if (type === 'string') return 'mainnet';
      if (type === 'number') return 1;
      if (type === 'buffer') return Buffer.from('01', 'hex');
      return 1;
    case 'mainnet':
      if (type === 'string') return 'mainnet';
      if (type === 'number') return 1;
      if (type === 'buffer') return Buffer.from('01', 'hex');
      return 1;
    case '3':
      if (type === 'string') return 'ropsten';
      if (type === 'number') return 3;
      if (type === 'buffer') return Buffer.from('03', 'hex');
      return 3;
    case 'ropsten':
      if (type === 'string') return 'ropsten';
      if (type === 'number') return 3;
      if (type === 'buffer') return Buffer.from('03', 'hex');
      return 3;
    case '42':
      if (type === 'string') return 'kovan';
      if (type === 'number') return 42;
      if (type === 'buffer') return Buffer.from('42', 'hex');
      return 42;
    case 'kovan':
      if (type === 'string') return 'kovan';
      if (type === 'number') return 42;
      if (type === 'buffer') return Buffer.from('42', 'hex');
      return 42;
    case '4':
      if (type === 'string') return 'rinkeby';
      if (type === 'number') return 4;
      if (type === 'buffer') return Buffer.from('04', 'hex');
      return 4;
    case 'rinkeby':
      if (type === 'string') return 'rinkeby';
      if (type === 'number') return 4;
      if (type === 'buffer') return Buffer.from('04', 'hex');
      return 4;
    case '5':
      if (type === 'string') return 'goerli';
      if (type === 'number') return 5;
      if (type === 'buffer') return Buffer.from('05', 'hex');
      return 5;
    case 'goerli':
      if (type === 'string') return 'goerli';
      if (type === 'number') return 5;
      if (type === 'buffer') return Buffer.from('05', 'hex');
      return 5;
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

Util.deriveChild = function (limit, page, publicKey, chainCode) {
  let list = [];
  let hdKey = new HDKey();
  hdKey.publicKey = Buffer.from(publicKey, 'hex');
  hdKey.chainCode = Buffer.from(chainCode, 'hex');
  for (let index = page * limit; index < page * limit + limit; index++) {
    let child = hdKey.derive('m/' + index);
    let addr = ethUtil.pubToAddress(child.publicKey, true /* multi pub-format */);
    let re = { index: index.toString(), address: Util.padHex(addr.toString('hex')) }
    list.push(re);
  }
  return list;
}

module.exports = Util;