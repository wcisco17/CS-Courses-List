require('dotenv').config();
const routes = require('./routes')
const express = require('express')
const {custom, lessons} = require('./util/custom-middleware')
const path = require("path");

const app = express();
const PORT = process.env.PORT

const rootPath = path.resolve(__dirname, "frontend");
app.use(express.static(rootPath));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    return next();
});

app.use('/static', [lessons.lessonsMiddleware, custom.staticMiddleware], express.static('files'));

app.use("/", routes.app);

let hostname = "0.0.0.0";
app.listen((PORT), hostname, () => {
    console.log(
        `Listening on PORT: ${PORT}`
    );
});
