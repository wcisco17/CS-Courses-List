require('dotenv').config();
const routes = require('./routes')
const express = require('express')
const path = require("path");

const app = express();
const PORT = process.env.PORT

const rootPath = path.resolve(__dirname, "frontend");
app.use(express.static(rootPath));

app.use("/", routes.app);

let hostname = "0.0.0.0";
app.listen((PORT), hostname, () => {
    console.log(`Listening on port: ${PORT}`);
});
