const { default: mongoose } = require("mongoose");


var TripModel = new mongoose.model("Trips", {
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    days: {
        type: Number,
        required: true
    },
    nights: {
        type: Number,
        required: true
    },
    createdOn: {
        type: Date,
        defualt: Date.now
    },
    date: {
        type: Date,
        required: true,
    },
    Images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Images'
    }],
    Users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }]
})

module.exports = TripModel