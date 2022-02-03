const {Request, Response} = require('express');
const {connectDB} = require('../util/db');
const {Collection, ObjectId} = require('mongodb')
const {uncompressedKey, constant, removeIdx} = require('../util/util');

/**
 * @param {Request} req
 * @param {Response} res
 */
exports.getOrders = async (req, res) => {
    let orders = []
    /*** @type {Array<string>} db */
    const cartItems = req.orders
    /** @type Array<any> */
    const lessons = req.lessons;

    for (const item of cartItems) {
        lessons.filter(lesson => {
            if (lesson._id.toString() === item.toString()) {
                orders.push(lesson)
            }
        })
    }

    res.send({cart: orders})
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

    /*** @type {Collection} */
    const addGuestOrder = (await connectDB(process.env.MONGODB_DB_NAME_TWO)).updateOne({order_id: cookieExist}, {
        $addToSet: {lessons: id},
    })

    /*** @type {Collection} */
    const updateLessons = (await connectDB(process.env.MONGODB_DB_NAME_ONE)).updateOne({_id: new ObjectId(id)}, {
        $inc: {availibility: -1},
    })

    return Promise.all([addGuestOrder, updateLessons])
        .then(() => {
            console.log({guestOrders: 'successfully saved', lessons: 'successfully saved'});
            cartItems.push(id)
            res.cookie(constant.CART_COOKIE_VALUE, cartItems)
            res.redirect('/')
        })
        .catch(error => {
            console.log(error)
            res.status(404).send({error: JSON.stringify(error)})
            // redirect back to main page
            setTimeout(() => {
                res.redirect("/")
            }, 2.0 * 1000)
        })
}

/**
 * @param {Request} req
 * @param {Response} res
 */
exports.deleteOrders = async (req, res) => {
    const id = req.body.id;
    const COOKIE_ID = process.env.COOKIE_ID;
    const orderIdCookie = uncompressedKey(req.cookies[COOKIE_ID]);

    /** @type {Array<string>} */
    let cartItems = req.cookies[constant.CART_COOKIE_VALUE];

    /*** @type {Collection} */
    const deleteGuestOrder = (await connectDB(process.env.MONGODB_DB_NAME_TWO)).updateMany({
        order_id: orderIdCookie,
    }, {
        $pull: {lessons: id}
    })

    /*** @type {Collection} */
    const resetLessons = (await connectDB(process.env.MONGODB_DB_NAME_ONE)).updateOne({_id: new ObjectId(id)}, {
        $set: {availibility: 5}
    })

    return Promise.all([deleteGuestOrder, resetLessons])
        .then(() => {
            console.log({deleteGuestOrders: 'successfully deleted', resetLessons: 'successfully reset'});
            removeIdx(id, cartItems)
            res.cookie(constant.CART_COOKIE_VALUE, cartItems)
            res.redirect("/")
        })
        .catch(error => {
            console.log(error)
            res.status(404).json({error: JSON.stringify(error)})
            // redirect back to main page
            setTimeout(() => {
                res.redirect("/")
            }, 2.0 * 1000)
        })
}