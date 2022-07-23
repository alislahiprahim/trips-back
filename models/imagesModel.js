const { default: mongoose } = require("mongoose");


var ImagesModel = new mongoose.model("Images", {
    _id: mongoose.Schema.Types.ObjectId,
    path: {
        type: String,
        uniqu: true
    }
})

module.exports = ImagesModel