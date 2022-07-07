const mongoose = require(`mongoose`)


let billSchema = new mongoose.Schema(
   {
        date: {type: String, min: Date.now, required: true}, 
        status: {type: String, enum: ['pending', 'delayed', 'paid'], required: true},
        tenant: {type: String, required: true},
        resident: {type: String, required: true}, //the resident that does the reservation
        property: {type: String, required: true},
        moneyAmount: {type: Number, validate: function(){return this.moneyAmount > 0}, required: true},
        monthlyDeadLine: {type: Number, validate: function(){return this.monthlyDeadLine > 0 && this.monthlyDeadLine < 30}, required: false},
        paymentDate: {type: String, required: false}
   },
   {
        collection: `bills`
   })

module.exports = mongoose.model(`bills`, billSchema)
