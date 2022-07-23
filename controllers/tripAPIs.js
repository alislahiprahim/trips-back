var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require("mongoose");
var parseUrlencoded = bodyParser.urlencoded({
    extended: true
});
const express_uploadFile = require("express-fileupload")
var saveFiles = require("../sharedMethods/saveFiles")
var TripModel = require("../models/tripModel")
const VerifyToken = require("../middelWare/VerifyToken")

router.post('/add', VerifyToken, express_uploadFile({ createParentPath: true }), async(req, resp) => {
    debugger
    var images = req.files.images
    var ImagesIDs = []
    const {
        name,
        description,
        days,
        nights,
        date
    } = req.body
    debugger
    // images = await saveFiles(images)
    // images.forEach(async element => {
    //     let x = await saveFiles(element)
    //     debugger
    //     if (x) {
    //         ImagesIDs.push(x)
    //     }
    // });
    // debugger
    // console.log(images);
    let new_Trip = new TripModel({
        _id: mongoose.Types.ObjectId(),
        name,
        description,
        days,
        nights,
        date,
        images: ImagesIDs
    })
    console.log(new_Trip);
    new_Trip.save((err, data) => {
        debugger
        if (err) {
            resp.send(JSON.stringify({ status: false, message: 'failed: something error 1', data: err.message }))
        } else {
            images.forEach(async element => {
                let x = await saveFiles(element)
                debugger
                if (x) {
                    TripModel.findOne({ _id: data.id }).exec((err2, Trip) => {
                        if (err2) {
                            resp.send(JSON.stringify({ status: false, message: 'failed: something error 1', data: err2.message }))
                        } else {
                            console.log(Trip);
                            Trip.Images.push(x)
                            Trip.save()
                        }




                    })
                }
            });
            resp.send(JSON.stringify({ status: true, message: 'success', data: data }))

            debugger
            console.log(images);
        }
    })
})


router.put('/update', VerifyToken, async(req, resp) => {

    const {
        name,
        description,
        days,
        nights,
        date,
        tripID,
        Images
    } = req.body


    let findTrip = await TripModel.findOne({ _id: tripID })

    if (findTrip) {
        TripModel.findOneAndUpdate({ _id: tripID }, {
            name,
            description,
            days,
            nights,
            date,
        }, (err, updatedData) => {
            if (err) {
                resp.send(JSON.stringify({ status: false, message: 'failed: something error ', err }))
            } else {
                resp.send(JSON.stringify({ status: true, message: 'success', data: updatedData }))
            }
        })
    } else {
        resp.send(JSON.stringify({ status: false, message: 'failed: Trip not found' }))
    }


})


router.delete('/delete/:tripID', VerifyToken, async(req, resp) => {

    const { tripID } = req.params
    let findTrip = await TripModel.findOne({ _id: tripID })
    if (findTrip) {
        TripModel.deleteOne({ _id: tripID }).exec((err) => {
            if (err) {
                resp.send(JSON.stringify({ status: false, message: 'failed: something error ', err }))
            } else {
                resp.send(JSON.stringify({ status: true, message: 'success: trip removed successfully' }))
            }
        })
    } else {
        resp.send(JSON.stringify({ status: false, message: 'failed: Trip not found' }))
    }
})


router.get('/getAllTrips', VerifyToken, (req, resp) => {
    TripModel.find({ date: { $gte: new Date() } }, 'name description days nights date images').populate({ path: 'Images', select: 'path' }).exec((err, data) => {
        if (err) {
            resp.send(JSON.stringify({ status: false, message: 'failed: something error ', err }))
        } else {
            resp.send(JSON.stringify({ status: true, message: 'success', data }))

        }
    })
})



router.get('/:TripId', VerifyToken, async(req, resp) => {
    const { TripId } = req.params
    TripModel.findOne({ _id: TripId }, '_id name description days nights date images').populate({ path: 'Images', select: 'path' }).exec((err, data) => {
        if (!err) {
            resp.send(JSON.stringify({ status: true, message: 'success', data: data }))

        } else {
            resp.send(JSON.stringify({ status: false, message: 'failed: trip not found', err: err.message }))
        }
    })
})

module.exports = router