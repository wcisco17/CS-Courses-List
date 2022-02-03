const {Request, Response} = require('express');
const {connectDB} = require('../util/db');
const {Collection} = require('mongodb')
const {uncompressedKey, constant} = require('../util/util');

/**
 * @param {Request} req
 * @param {Response} res
 */
exports.getOrders = async (req, res) => {
    let orders = []
    /*** @type {Array<{_id: string}>} db */
    const cartItems = req.cookies[constant.CART_COOKIE_VALUE];
    /** @type Array<any> */
    const lessons = req.lessons;

    for (const item of cartItems) {
        lessons.filter(lesson => {
            if (lesson._id.toString() === item._id.toString()) {
                orders.push(lesson)
            }
        })
    }

    res.json({ cart: orders }) // handle duplicates in the cart.
}

/**
 * @param {Request} req
 * @param {Response} res
 */
exports.addOrders = async (req, res) => {
    const id = req.body.id;
    const COOKIE_ID = process.env.COOKIE_ID;
    const cookieExist = uncompressedKey(req.cookies[COOKIE_ID]);
    let cartItems = req.cookies[constant.CART_COOKIE_VALUE];

    /*** @type {Collection} db */
    const db = await connectDB(process.env.MONGODB_DB_NAME_TWO);
    return db.updateOne({
        order_id: cookieExist
    }, {
        $addToSet: {
            lessons: id // create a separate function to save items in the cache...
        },
    }, (error, _) => {
        if (error)
            throw new Error(`[Error_addOrders Controller]: ${error}`)

        cartItems.push({_id: id})
        res.cookie(constant.CART_COOKIE_VALUE, cartItems)
        // update the cache here
        res.redirect('/')
    })
}
