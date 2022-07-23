const RenameImage = (name) => {
    var list = name.split('.')
    var date = Date.now()
    return list[0] + date + '.' + list[1]
}
module.exports = RenameImage