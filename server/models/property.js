const mongoose = require(`mongoose`)

let propImagesSchema = new mongoose.Schema(
{
     filename:{type:String}
})

let propertySchema = new mongoose.Schema(
   {
        tenant: {type: String, required: true},
        address: {type: String, required: true}, //the PK property will be considered on middleware not here
        area: {type: Number, validate: function(){return this.area > 0} ,required: true},
        price: {type: Number,validate: function(){return this.price > 0}, required: true},
        resident: {type: String, default: 'none',required:false}, /* this is the _id of the resident that does the reservation */
        images: [propImagesSchema]
   },
   {
        collection: `property`
   })

module.exports = mongoose.model(`property`, propertySchema)