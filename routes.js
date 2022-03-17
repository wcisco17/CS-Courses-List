const {Router} = require('express')
const bodyParser = require('body-parser')
const {addOrders, getOrders} = require('./controllers/orders');
const cookieParser = require('cookie-parser')
const {getLessons, updatesLessons} = require('./controllers/lessons');
const {Collection} = require('mongodb')
const {ObjectId} = require('mongodb');
const cors = require('cors')
const {lessons, orders, custom} = require('./util/custom-middleware');
const {connectDB} = require('./util/db');

const app = Router();
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/orders', [lessons.lessonsMiddleware, orders.refreshCart, custom.logger], getOrders)
app.put(`/update_lessons`, [orders.initializeOrders, custom.logger], updatesLessons)
app.get('/lessons', [lessons.lessonsMiddleware, orders.initializeOrders], getLessons)


app.post('/addOrder', async (req, res) => {
    /**** @type {Collection}*/
    const db = await connectDB(process.env.MONGODB_DB_NAME_TWO);
    db.updateOne()
})

app.get('/all_orders', lessons.lessonsMiddleware, async (req, res) => {
    let err = ''
    const lessons = req.lessons;

    /**** @type {Collection}*/
    const db = await connectDB(process.env.MONGODB_DB_NAME_TWO);
    db.findOne({
        order_id: '047f6d6c9bae2780258f566f9cfae93757c8e27b0f056fd3d182894271c32724f87f1d6a9ee6d1c56cca6a4dbafe57a8fd38d00add64026344a02d1facdef5cda5',
    }, (error, data) => {
        if (error) {
            console.error(`Error ${error}`)
            err = 'Error'
        }
        if (data) {
            const currentOrders = data?.lessons;
            let orders = []

            if (currentOrders.length >= 1)
                for (let order of currentOrders)
                    orders.push(lessons.find(items => new ObjectId(items._id).toJSON() === new ObjectId(order._id).toJSON()));
            else
                orders = [];

            res.send(orders)
        }
    })
    if (err.length >= 1)
        res.send(err)
})

app.post('/add_order', [orders.initializeOrders, custom.logger], addOrders);

module.exports = {app}
