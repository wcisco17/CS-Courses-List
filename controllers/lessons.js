const {connectDB} = require('../util/db');
const {ObjectId} = require('mongodb');
const {constant, uncompressedKey} = require('../util/util');

/**
 * @param {Request} req
 * @param {Response} res
 */
exports.getLessons = async (req, res) => {
    res.json({lessons: req.lessons})
}

/**
 * @function updateLessons - Updates two parts: The overall Lesson query & Whenever there is change when purchasing a
 * @param {Request} req
 * @param {Response} res
 */
exports.updatesLessons = async (req, res) => {
    const cartItems = req.orders;
    const COOKIE_ID = process.env.COOKIE_ID;
    const orderIdCookie = uncompressedKey(req.cookies[COOKIE_ID]);

    const deleteGuestOrder = cartItems.map(async items => {
        (await connectDB(process.env.MONGODB_DB_NAME_TWO))?.updateOne({
            order_id: orderIdCookie,
        }, {
            $pull: {lessons: { _id: items._id }}
        })
    })

    const resetLessons = cartItems.map(async items => {
        (await connectDB(process.env.MONGODB_DB_NAME_ONE)).updateOne({_id: new ObjectId(items._id)}, {
            $set: {availibility: (items.quantity)}
        })
    })

    return Promise.all([deleteGuestOrder, resetLessons])
        .then(() => {
            console.log({deleteGuestOrders: 'successfully deleted', resetLessons: 'successfully reset'});

            res.cookie(constant.CART_COOKIE_VALUE, [{ _id: '', quantity: 0 }])
            res.redirect('/')
        })
        .catch(error => {
            return error
        })
}














