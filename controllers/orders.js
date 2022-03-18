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
    res.send(orders)
}

/**
 * @param {Request} req
 * @param {Response} res
 */
exports.addOrders = async (req, res) => {
    const cookieExist = process.env.GUEST_USER;
    const isRemoveOrder = req.body.removeLesson;
    let orders = {_id: req.body.id, quantity: (Number(req.body.quantity))}
    let result;

    const orderExist = req.orders?.lessons.find(prevCartOrder => prevCartOrder._id === orders._id);

    let updateOrders;
    let db = (await connectDB(process.env.MONGODB_DB_NAME_TWO));

    // if both are true we remove the order from list [all together]
    if (orderExist && isRemoveOrder) {
        updateOrders = {
            filter: {
                order_id: cookieExist,
            },
            update: {
                $pull: {
                    lessons: {_id: orderExist._id, quantity: orderExist.quantity}
                }
            }
        }
    }
    // if the orderExists only update the quantity
    else if (orderExist) {
        updateOrders = {
            filter: {
                order_id: cookieExist,
                "lessons._id": orders._id
            },
            update: {
                $set: {
                    "lessons.$.quantity": orders.quantity
                }
            },
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

    return db?.updateOne({...updateOrders.filter}, {...updateOrders.update}, {})
        .then(() => {
            result = {result: 'success'}
            res.send(result)
        }).catch(err => err)
}