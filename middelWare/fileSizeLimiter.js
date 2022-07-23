const MB = 5; //5 MB
const File_Size_Limit = MB * 1024 * 1024

const fileSizeLimiter = (req, resp, next) => {
    const files = req.files
    const filesOverLimit = []

    Object.keys(files).forEach(key => {
        if (files[key].size > File_Size_Limit) {
            filesOverLimit.push(files[key].name)
        } else {

        }

    })

    if (filesOverLimit.length) {
        const properVerb = filesOverLimit.length > 1 ? 'are' : 'is';

        const sentence = `Upload failed. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${MB} MB.`;

        const message = filesOverLimit.length < 3 ?
            sentence.replace(",", " and ") :
            sentence.replace(/,(?=[^,]*$)/, " and ");

        return resp.status(413).json({ status: "error", message });
    }
    next()

}
module.exports = fileSizeLimiter