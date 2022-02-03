const {Router} = require('express')
const bodyParser = require('body-parser')
const {addOrders, getOrders} = require('./controllers/orders');
const cookieParser = require('cookie-parser')
const {getLessons, updatesLessons} = require('./controllers/lessons');
const cors = require('cors')
const {lessons} = require('./util/custom-middleware');

const app = Router();
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/orders', [lessons.lessonsMiddleware], getOrders)
app.put(`/update_lessons`, updatesLessons)
app.get('/lessons', [lessons.lessonsMiddleware, lessons.initializeOrders], getLessons)
app.post('/process_orders', addOrders);

module.exports = {app}
