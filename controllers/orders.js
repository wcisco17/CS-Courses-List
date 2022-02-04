const {Request, Response} = require('express');
const {connectDB} = require('../util/db');
const {uncompressedKey, constant, filterOrders,} = require('../util/util');

/**
 * @param {Request} req
 * @param {Response} res
 */
exports.getOrders = async (req, res) => {
    let orders = []
    /*** @type {Array<{_id: string, quantity: number}>} db */
    const cartItems = req.orders
    /** @type Array<any> */
    const lessons = req.lessons;
    filterOrders(cartItems, lessons, orders)
    res.send({cart: orders})
}

/**
 * @param {Request} req
 * @param {Response} res
 */
exports.addOrders = async (req, res) => {
    const COOKIE_ID = process.env.COOKIE_ID;
    const cookieExist = uncompressedKey(req.cookies[COOKIE_ID]);
    let cartItems = req.cookies[constant.CART_COOKIE_VALUE];
    let orders = {_id: req.body.id, quantity: (Number(req.body.quantity))}
    let result;
    return (await connectDB(process.env.MONGODB_DB_NAME_TWO)).updateOne({
            order_id: cookieExist,
        }, {
            $addToSet: {lessons: orders},
        },
    ).then(() => {
        console.log({
            guestOrders: 'updateOne - successfully saved',
            lessons: 'updateOne - successfully saved'
        });
        result = {result: 'success'}
        cartItems.push(orders)
        res.cookie(constant.CART_COOKIE_VALUE, cartItems)
        res.send(result)
    }).catch(error => {
        // redirect back to main page
        result = {result: 'error'}
        res.send(result)
    })
}