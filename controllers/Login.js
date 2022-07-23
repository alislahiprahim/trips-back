var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require("bcryptjs");
var parseUrlencoded = bodyParser.urlencoded({
    extended: true
});

var UserModel = require("../models/usersModel")

router.post('/', parseUrlencoded, async(req, resp) => {

    const { email, password } = req.body
    console.log(`user email ==> ${email}`)
    console.log(`user password ==> ${password}`)
    let user = await UserModel.findOne({ email })
    if (user) {
        let PasswordCorrect = await bcrypt.compare(password, user.password)
        if (PasswordCorrect == true) {
            let payload = { subject: user._id }
            let token = jwt.sign(payload, 'secretKey')
            resp.send(JSON.stringify({ status: true, message: 'success', token, user: { id: user._id, name: user.name, phone: user.phone, email: user.email, } }))

        } else {
            resp.send(JSON.stringify({ status: false, message: 'failed: invalid password' }))

        }
    } else {
        resp.send(JSON.stringify({ status: false, message: 'failed: this user not register' }))
    }
    // resp.send(JSON.stringify({ status: , message: '', data: '' }))

})










module.exports = router