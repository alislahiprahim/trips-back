const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const app = express()
const cors = require("cors");
const server = require('http').createServer(app)
app.use(bodyParser.json())
var router = express.Router()
var VerifyToken = require("./middelWare/VerifyToken")

mongoose.connect("mongodb://localhost:27017/Traveling")
mongoose.connection.on("error", err => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(1);
});

app.use(
    cors({
        origin: ' http://localhost:4200',
        credentials: true,
        maxAge: 1000000
    })

)

app.get('/', (req, resp) => {

    const {} = req.body
    resp.send(JSON.stringify({ status: true, message: 'Server Is Running', data: 'No data' }))

})
var User = require("./controllers/userAPIs")
var Trip = require("./controllers/tripAPIs")
var Login = require("./controllers/Login")

app.use("/user", User)
app.use("/trip", Trip)
app.use('/login', Login)

app.get('/resources/images/:fileName', VerifyToken, (req, resp) => {
    const { fileName } = req.params
    var __dirname = "./resources/images/"
    resp.sendFile(fileName, { root: __dirname }, (err, data) => {
        console.log("err", err)
        console.log("data", data)
    })
})

server.listen(8085)