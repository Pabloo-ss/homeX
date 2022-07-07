const mongoose = require(`mongoose`)

let tenantSchema = new mongoose.Schema(
   {
        userID: {type: String, required:true},
        name: {type: String, required: true},
        id: {type: String, required: true},
        phoneNumber: {type: String, required: true},
   },
   {
        collection: `tenants`
   })

module.exports = mongoose.model(`tenants`, tenantSchema)