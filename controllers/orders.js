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

    const orderExist = req.orders?.find(prevCartOrder => prevCartOrder._id === orders._id);

    let updateOrders;
    let db = (await connectDB(process.env.MONGODB_DB_NAME_TWO));

    // if the orderExists only update the quantity
    if (orderExist) {
        updateOrders = {
            filter: {
                order_id: cookieExist,
                "lessons._id": orders._id
            },
            update: {
                $set: {
                    "lessons.$.quantity": orders.quantity
                }
            }
        }
    }
    // if it's a brand-new order append it to the lessons array
    else {
        updateOrders = {
            filter: {
                order_id: cookieExist
            },
            update: {
                $addToSet: {
                    lessons: orders
                }
            }
        }
    }

    return db?.updateOne({...updateOrders.filter}, {...updateOrders.update})
        .then(() => {
            cartItems.push(orders)
            res.cookie(constant.CART_COOKIE_VALUE, cartItems)
            result = {result: 'success'}
            res.send(result)
        }).catch(err => err)
}