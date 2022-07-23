var bcrypt = require("bcryptjs");

async function PasswordGenerator(password) {
    let salt = await bcrypt.genSalt(10)

    let encribted = await bcrypt.hash(password, salt)

    return encribted
}
module.exports = PasswordGenerator