var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require("mongoose");
var PasswordGenerator = require("../sharedMethods/passwordGerator")
var parseUrlencoded = bodyParser.urlencoded({
    extended: true
});
const UserModel = require('../models/usersModel')
const VerifyToken = require("../middelWare/VerifyToken")
router.post('/signUp', parseUrlencoded, async(req, resp) => {

    const { name, email, phone, password } = req.body
    const newUser = new UserModel({
        _id: mongoose.Types.ObjectId(),
        name,
        email,
        phone,
        password
    })
    let UserAlradyRegister = await checkUserAlradyRegister(email, phone)
    console.log(UserAlradyRegister)
    if (UserAlradyRegister) {
        resp.json({ status: false, message: "failed:User already register" })
    } else {
        newUser.password = await PasswordGenerator(newUser.password);

        newUser.save((err) => {
            if (err) {
                resp.json({ "message": "error" })
            } else {
                // check newUser._id in debug
                const payload = { subject: newUser._id }
                const token = jwt.sign(payload, 'secretKey')
                resp.json({ status: true, message: "success", token, userData: { newUser } })
            }
        });
    }




})

router.put('/update', parseUrlencoded, VerifyToken, async(req, resp) => {

    const { name, email, phone, password, userID } = req.body
    let user = await UserModel.findOne({ _id: userID })
    if (user) {

        let PasswordIncrypted = await PasswordGenerator(password)

        UserModel.findOneAndUpdate({ _id: userID }, { name, email, phone, password: PasswordIncrypted }, (err, updatedData) => {
            if (err) {
                resp.send(JSON.stringify({ status: false, message: 'Failed: erroe on save data' }))
            } else {
                resp.send(JSON.stringify({ status: true, message: 'Success: User updated successfully' }))
            }
        })
    } else {
        resp.send(JSON.stringify({ status: false, message: 'Failed: user not found' }))
    }
})


async function checkUserAlradyRegister(email, phone) {
    let userAlradyIn = await UserModel.findOne({ $or: [{ 'email': email }, { 'phone': phone }] })
    if (userAlradyIn)
        return true
    else
        return false
}

module.exports = router