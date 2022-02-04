const {Router} = require('express')
const bodyParser = require('body-parser')
const {addOrders, getOrders} = require('./controllers/orders');
const cookieParser = require('cookie-parser')
const {getLessons, updatesLessons} = require('./controllers/lessons');
const cors = require('cors')
const {lessons, orders} = require('./util/custom-middleware');

const app = Router();
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/orders', [
    lessons.lessonsMiddleware,
    orders.initializeOrders,
], getOrders)
app.put(`/update_lessons`, orders.initializeOrders, updatesLessons)
app.get('/lessons', [lessons.lessonsMiddleware, orders.initializeOrders], getLessons)
app.post('/add_order', addOrders);

module.exports = {app}
