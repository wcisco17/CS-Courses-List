const crypto = require('crypto');

/**
 * @param {String} key
 */
exports.uncompressedKey = (key) => {
    return crypto.ECDH.convertKey(Buffer.from(key),
        'secp256k1',
        'base64',
        'hex',
        'uncompressed'
    );
}

exports.constant = {
    CART_COOKIE_VALUE: 'CART'
}