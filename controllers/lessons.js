const {connectDB} = require('../util/db');
const {constant, uncompressedKey, transformLessonsWithQuantity} = require('../util/util');

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
    console.log(cartItems)
    const deleteGuestOrder = cartItems.map(async items => {
        (await connectDB(process.env.MONGODB_DB_NAME_TWO))?.updateOne({
            order_id: orderIdCookie,
        }, {
            $pull: {lessons: {_id: items._id}}
        })
    })

    const resetLessons = cartItems.map(async items => {
        (await connectDB(process.env.MONGODB_DB_NAME_ONE)).updateOne({id: items.id}, {
            $set: {availibility: (items.quantity)}
        })
    })

    return Promise.all([deleteGuestOrder, resetLessons])
        .then((data) => {
            console.log({data})
            console.log({deleteGuestOrders: 'successfully deleted', resetLessons: 'successfully reset'});

            res.cookie(constant.CART_COOKIE_VALUE, [{_id: '', quantity: 0}])
            res.send({ result: 'success' })
        })
        .catch(error => {
            return error
        })
}




