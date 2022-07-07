const mongoose = require(`mongoose`)

const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const accessLevels = [0, 1, 2]

let userSchema = new mongoose.Schema(
   {
        name: {type: String, required: true},
        email: {type: String, match: [emailPattern, "Email must be valid."], required: true, unique:true},
        password: {type: String, required: true},
        accessLevel: {type: Number, match: [accessLevels, "Invalid Access Level"], required: true}
   },
   {
        collection: `users`
   })

module.exports = mongoose.model(`users`, userSchema)