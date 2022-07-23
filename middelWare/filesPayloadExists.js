const filesPayloadExists = (req, resp, next) => {
    if (!req.files) return resp.status(400).json({ message: "Missing files", status: "error" })
    next()
}
module.exports = filesPayloadExists