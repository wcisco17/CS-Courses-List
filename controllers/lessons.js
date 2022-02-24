const {connectDB} = require('../util/db');
const {constant, uncompressedKey, transformLessonsWithQuantity} = require('../util/util');
const {ObjectId} = require('mongodb');

/**
 * @param {Request} req
 * @param {Response} res
 */
exports.getLessons = async (req, res) => {
    transformLessonsWithQuantity(req.orders, req.lessons)
    res.json({lessons: req.lessons})
}

/**
 * @function updateLessons - Updates two parts: The overall Lesson query & Whenever there is change when purchasing aN ITEM
 * @param {Request} req
 * @param {Response} res
 */
exports.updatesLessons = async (req, res) => {
    const cartItems = req.orders;
    const COOKIE_ID = process.env.COOKIE_ID;
    const orderIdCookie = uncompressedKey(req.cookies[COOKIE_ID]);
    const filterEmptyStr = cartItems.filter((cartItem) => cartItem._id.length >= 24);
    const deleteGuestOrder = filterEmptyStr.map(async items => {
        (await connectDB(process.env.MONGODB_DB_NAME_TWO))?.updateOne({
            order_id: orderIdCookie,
        }, {
            $set: {ordered: true}
        })
    })

    const resetLessons = filterEmptyStr.map(async items => {
        (await connectDB(process.env.MONGODB_DB_NAME_ONE)).updateOne({
            _id: new ObjectId(items._id)
        }, {
            $set: {availibility: (items.quantity)}
        })
    })

    return Promise.all([deleteGuestOrder, resetLessons])
        .then(() => {
            // reset cookies and cart
            res.clearCookie(COOKIE_ID)
            res.clearCookie(constant.CART_COOKIE_VALUE)

            res.send({result: 'success'})
        })
        .catch(error => {
            return error
        })
}

/**
 * @param {Request} req
 * @param {Response} res
 *
 */
exports.search = (req, res) => {

}




