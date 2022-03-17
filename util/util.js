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
 * @param {Array<{_id: string, quantity: number}>} orders
 */
exports.removeDuplicates = (orders) => {
    if (!orders) return [{_id: '', quantity: 0}]
    let res = []
    let mapping = {}
    orders?.filter(order => {
        if (mapping[order._id] !== order._id) {
            mapping[order._id] = order.quantity // takes the lowest value
        }
    })

    const quantity = Object.values(mapping)
    const _id = Object.keys(mapping)

    if (quantity.length === _id.length) {
        for (let i = 0; i < _id.length; i++) {
            res.push({_id: _id[i], quantity: quantity[i]})
        }
    }

    return res
}

/**
 *
 * @param {Array<{_id: string, quantity: number}>} cartItems
 * @param {Array<any>} lessons
 * @param {Array<any>} orders
 */
exports.filterOrders = (cartItems, lessons, orders) => {
    for (const item of cartItems.lessons) {
        lessons.filter(lesson => {
            if (lesson._id.toString() === item._id.toString()) {
                orders.push({
                    ...lesson,
                    quantity: item.quantity
                })
            }
        })
    }
    return orders;
}

/**
 * @param {Array<{_id: string, quantity: number}>} cartItems
 * @param {Array<any>} lessons
 */
exports.transformLessonsWithQuantity = (cartItems, lessons) => {
    cartItems?.lessons.map((order) => {
        lessons?.filter((lesson, i) => {
            if (order._id === lesson._id.toString()) {
                lessons.splice(i, 1)
                lessons.push({
                    ...lesson,
                    quantity: order.quantity
                })
            }
        })
    })
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

