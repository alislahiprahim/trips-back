const { default: mongoose } = require("mongoose");


var UserModel = new mongoose.model("Users", {
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        uniqu: true
    },
    phone: {
        type: String,
        required: true,
        uniqu: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = UserModel