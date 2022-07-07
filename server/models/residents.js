const mongoose = require(`mongoose`)

let residentSchema = new mongoose.Schema(
   {
        userID: {type: String, required:true},
        name: {type: String, required: true},
        id: {type: String, required: true},
        phoneNumber: {type: String, required: true},
   },
   {
        collection: `residents`
   })

module.exports = mongoose.model(`residents`, residentSchema)