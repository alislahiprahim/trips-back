const ImageModel = require("../models/imagesModel")
const mongoose = require("mongoose")
const RenameImage = require("../sharedMethods/RenameImage")
const path = require("path")
const saveFilesInDirecory = async(element) => {
    // var failedImages = []
    // var imagesIDs = []
    debugger
    // files.forEach(async element => {
    let image_Name = RenameImage(element.name)
    console.log(image_Name);
    debugger
    const filePath = path.join(__dirname, "../resources/images", image_Name)
    element.mv(filePath, (err, data) => {
        if (err) {
            debugger
            return false
        }
    })
    debugger
    let newImage = new ImageModel({
        _id: mongoose.Types.ObjectId(),
        path: image_Name
    })
    debugger
    let x = await newImage.save()
    debugger
    console.log(x.id);
    if (x && x.id) {
        console.log("Here 1");
        return x.id
    } else {
        return false
    }
    debugger
    // })

    // return { failedImages, imagesIDs }
}
module.exports = saveFilesInDirecory