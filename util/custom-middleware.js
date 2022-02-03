// custom logger middleware to output server console
const {connectDB} = require('./db');
const {Collection} = require('mongodb')
const {NextFunction} = require('express')
const crypto = require('crypto');
const {constant, uncompressedKey, removeDuplicates} = require('./util');

exports.logger = () => {
    // @TODO – Create a ‘logger’ middleware that output all requests to the server console
    //  @TODO - Create a static file middleware that returns lesson images or an error message if the image file does not exist.
}

exports.orders = {
    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    initializeOrders: async (req, res, next) => {
        const COOKIE_ID = process.env.COOKIE_ID;
        const cookieExist = req.cookies[COOKIE_ID]
        const orderCookieList = req.cookies[constant.CART_COOKIE_VALUE]
        let db;
        let cartItems = []

        /*** @type {ECDH} db */
        const user = crypto.createECDH('secp256k1');
        const userKey = user.generateKeys();

        // we set both cookies first
        if (!cookieExist && !orderCookieList) {
            /*** @type {Collection} db */
            db = await connectDB(process.env.MONGODB_DB_NAME_TWO);

            res.cookie(COOKIE_ID, userKey)
            res.cookie(constant.CART_COOKIE_VALUE, cartItems)
            return db.insertOne({
                order_id: userKey.toString('hex'),
                lessons: [],
            }, {}, (error, _) => {
                if (error)
                    throw new Error(`[Error_initializeOrders Controller]: ${error}`)

                console.log('Saved')
                next()
            })
        }
        // refresh the cookie if null;
        else {
            /**** @type {Collection}*/
            db = await connectDB(process.env.MONGODB_DB_NAME_TWO)
            const ordersKey = req.cookies[COOKIE_ID];
            const userKey = uncompressedKey(ordersKey);

            if (!orderCookieList) {
                return db.findOne({
                    order_id: userKey
                }, (err, data) => {
                    if (err) {
                        req.orders = [];
                        next()
                    }
                    const orderIdDB = data.lessons;
                    req.orders = orderIdDB;
                    res.cookie(constant.CART_COOKIE_VALUE, orderIdDB)
                    next()
                })
            } else {
                // filter process here
                console.log('cookie exist')
                req.orders = removeDuplicates(orderCookieList);
                next()
            }
            next()
        }
    },
}

exports.lessons = {
    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    lessonsMiddleware: async (req, res, next) => {
        /**** @type {Collection}*/
        const db = await connectDB(process.env.MONGODB_DB_NAME_ONE)
        return db
            .find({})
            .toArray((err, lessons) => {
                if (err) {
                    throw new Error(`[Error getLessons] - ${err}`)
                    req.lessons = []
                    next()
                }
                if (lessons.length <= 0) {
                    req.lessons = []
                    next()
                }
                req.lessons = lessons
                next()
            })
    },
}