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

/***
 * @param {Array<string>} orders
 */
exports.removeDuplicates = (orders) => {
    let mapping = {}
    orders?.filter(order => {
        if (mapping[order] !== order) {
            mapping[order] = true
        }
    })

    return Object.keys(mapping)
}


/**
 * @param {string} idx
 * @param {Array<string>} cartItems
 */
exports.removeIdx = (idx, cartItems) => {
    return cartItems.find((item, i) => {
        if (item === idx) {
            cartItems.splice(i, 1)
        }
    })
}

exports.constant = {
    CART_COOKIE_VALUE: 'CART'
}

