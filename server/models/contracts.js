const mongoose = require(`mongoose`)


let propResidentsSchema = new mongoose.Schema(
{
     name:{type:String, required: true},
     id:{type:String, required: true},
})

let contractSchema = new mongoose.Schema(
   {
        date: {type: String, min: Date.now, required: true}, /* When the contract starts, not when created */
        status: {type: String, enum: ['requested', 'confirmated', 'signed', 'completed'], required: true},
        tenant: {type: String, required: true},
        resident: {type: String, required: true}, //the users that does the reservation
        residents: [propResidentsSchema],
        property: {type: String, required: true},
        expireDate: {type: String, min: Date.now, required: true},
        moneyAmount: {type: Number, validate: function(){return this.moneyAmount > 0}, required: true},
        monthlyDeadLine: {type: Number, validate: function(){return this.monthlyDeadLine > 0 && this.monthlyDeadLine < 30}, required: false},
   },
   {
        collection: `contracts`
   })

module.exports = mongoose.model(`contracts`, contractSchema)

//validate: function(input){return typeof new Date(input*1000) === 'date' && new Date(input*1000) >= new Date()},