// custom logger middleware to output server console
const {connectDB} = require('./db');
const {Collection} = require('mongodb')
const {NextFunction} = require('express')
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const {constant, uncompressedKey, removeDuplicates} = require('./util');

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
        /**** @type {Array<_id: string, quantity: number>}*/
        let cartItems = [{_id: '', quantity: 0}]

        /*** @type {ECDH} db */
        const user = crypto.createECDH('secp256k1');
        const userKey = user.generateKeys();

        // we set both cookies first
        if (!cookieExist && !orderCookieList) {
            /*** @type {Collection} db */
            db = await connectDB(process.env.MONGODB_DB_NAME_TWO);

            res.cookie(COOKIE_ID, userKey)
            res.cookie(constant.CART_COOKIE_VALUE, cartItems)
            db.insertOne({order_id: userKey.toString('hex'), lessons: [], ordered: false}, {}, (error, _) => {
                if (error)
                    throw new Error(`[Error_initializeOrders Controller]: ${error}`)
                else
                    console.log('Saved')
            })
            next()
        }
        // refresh if the cookie is null.
        else if (!orderCookieList) {
            /**** @type {Collection}*/
            db = await connectDB(process.env.MONGODB_DB_NAME_TWO)
            const ordersKey = req.cookies[COOKIE_ID];
            const userKey = uncompressedKey(ordersKey);

            return db.findOne({
                order_id: userKey
            }, (err, data) => {
                if (err) {
                    req.orders = [{_id: '', quantity: 0}];
                    next()
                }
                const orderIdDB = data?.lessons;
                req.orders = orderIdDB;
                res.cookie(constant.CART_COOKIE_VALUE, orderIdDB)
                next()
            })
        } else {
            req.orders = removeDuplicates(orderCookieList);
            next()
        }
    },
    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    refreshCart: async (req, res, next) => {
        const orderCookieList = req.cookies[constant.CART_COOKIE_VALUE]
        if (!orderCookieList) {
            req.orders = []
            next()
        } else {
            req.orders = removeDuplicates(orderCookieList);
            next()
        }
    }
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

exports.custom = {
    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    logger: (req, res, next) => {
        const customReq = req;
        console.log('[CUSTOM_LOGGER]: Route visited: ', customReq.originalUrl);
        next()
    },

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */

    staticMiddleware: async (req, res, next) => {
        const lessonsImg = req.lessons;
        const dir_path = path.resolve(__dirname, '../files');
        const dir_exist = fs.existsSync(dir_path);
        if (!dir_exist) {
            fs.mkdirSync(dir_path)
            lessonsImg.map((files) => {
                const data = JSON.stringify({id: files._id, img: files.url})
                try {
                    const fileName = `${dir_path}/${files._id}.json`;
                    fs.writeFileSync(fileName, data);
                } catch (err) {
                    throw new Error(`Could not write file reason: ${err}`)
                }
            })
            res.send('success')
        } else if (dir_exist) {
            try {
                const files = fs.readdirSync(dir_path);
                let allImg = []
                files.map((items) => {
                    const allFiles = fs.readFileSync(`${dir_path}/${items}`)
                    const lessonsImg = JSON.parse(Buffer.from(allFiles).toString())
                    allImg.push(lessonsImg)
                })
                res.send(allImg)
            } catch (err) {
                throw new Error(`Could not write file reason: ${err}`)
            }
        }
    }

}
