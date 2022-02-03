const {connectDB} = require('../util/db');
const {Collection} = require('mongodb')

/**
 * @param {Request} req
 * @param {Response} res
 */
exports.getLessons = async (req, res) => res.json({lessons: req.lessons})

/**
 * @function updateLessons - Updates two parts: The overall Lesson query & Whenever there is change when purchasing a
 * @param {Request} req
 * @param {Response} res
 */
exports.updatesLessons = async (req, res) => {
    /**** @type {Collection}*/
    const db = await connectDB(process.env.MONGODB_DB_NAME_ONE);

}














