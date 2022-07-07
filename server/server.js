// Server-side global variables
require(`dotenv`).config({path:`./config/.env`})
require(`./config/db`)
var bodyParser = require('body-parser')
const createError = require('http-errors')


// Express
const express = require(`express`)
const app = express()

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use(require(`cors`)({credentials: true, origin: process.env.LOCAL_HOST}))

const router = require(`express`).Router()
// Port
app.listen(process.env.SERVER_PORT, () => 
{
    console.log(`Connected to port ` + process.env.SERVER_PORT)
})

app.use(require(`./routes/users`))
app.use(require(`./routes/properties`))
app.use(require(`./routes/contracts`))
app.use(require(`./routes/bills`))

// Error 404
app.use((req, res, next) => {next(createError(404))})


// Handle errors
app.use(function (err, req, res, next)
{       
    if (!err.statusCode) 
    {
        err.statusCode = 500
    }
    
    // check that all required parameters are not empty in any route
    if (err instanceof ReferenceError)
    {
        err.statusCode = 400
        err.message = "Cannot reference a variable that has not been declared. This can be caused in run-time if the user did not input a parameter that is required by a router"
    }
    
    // Server-side error message
    console.log(err.message + "\nError Details...")
    // Server-side error details
    console.log(err)
    
    // return error message that will be displayed on client-side console
    res.status(err.statusCode).send(err.message)    
})