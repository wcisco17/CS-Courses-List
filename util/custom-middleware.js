// custom logger middleware to output server console
const {connectDB} = require('./db');
const {Collection, ObjectId} = require('mongodb')
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
        let err = ''
        const lessons = req.lessons;

        /**** @type {Collection}*/
        const db = await connectDB(process.env.MONGODB_DB_NAME_TWO);
        db.findOne({
            order_id: '04219644ee0c6b8e954e6ea8f335c0f995911ff00ef4250710cdf39f6c8bf391d83520d527d12b0ed018c56562d5d829ce094348e1089f0f8d8ad64bb8be8b3a14',
        }, (error, data) => {
            if (error) {
                console.error(`Error ${error}`)
                err = 'Error'
            }
            if (data) {
                req.orders = (data)
                next()
            }
        })
        if (err.length >= 1) {
            req.orders = [];
            next()
        }
    },
    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    refreshCart: async (req, res, next) => {
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
