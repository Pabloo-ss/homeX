const router = require(`express`).Router()
const contractModel = require(`../models/contracts`)
const propertiesModel = require(`../models/property`)
const usersModel = require(`../models/users`)
const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const multer  = require('multer')
var upload = multer({dest: `${process.env.UPLOADED_FILES_FOLDER}`})

//Middleware
const checkUserLogged = (req, res, next) =>
{
    jwt.verify(req.headers.authorization, process.env.JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodedToken) => 
    {
        if (err) 
        { 
            return next(createError(400, "User is not logged in."))
        }
        else 
        {
            req.decodedToken = decodedToken
            return next()
        }
    })
}

const checkContractExists = (req, res, next) =>
{
    contractModel.findOne({_id: req.params.idCon}, (error, data) =>
    {
        if(error){
            return next(createError(400, "Error checking contract existance"))
        }else{
            if(!data)
                return next(createError(400, "Contract doesn't exists."))
            else
            {
                req.contract = data
                return next()
            }
        }
    })
}

const checkAvaliable = (req, res, next) =>{

    propertiesModel.findOne({_id: req.contract.property}, (error, data) =>
    {
        if(error){
            return next(createError(400, "Error checking avaliability"))
        }else{
            if(data){
                if(data.resident === 'none'){
                    req.property = data
                    return next()
                }
                else{
                    return next(createError(400, "Property is not avaliable"))
                }
            }
        }
              
    })
}

const checkUserTenant = (req, res, next) => {
    if(req.decodedToken.email === req.contract.tenant){
        //user logged in is the same as the one on the contract
        return next()
    }else{
        //user logged in isnt the same as in the contract
        return next(createError(400, "User making the request is not on the contract."))
    }
}

const checkUserResident = (req, res, next) => {
    if(req.decodedToken.email === req.contract.resident){
        //user logged in is the same as the one on the contract
        return next()
    }else{
        //user logged in isnt the same as in the contract
        return next(createError(400, "User making the request is not on the contract."))
    }
}

const confirmContract = (req, res, next) =>{
    let contract = new Object()
    contract.date = req.body.date
    contract.status = 'confirmed'
    contract.expireDate = req.body.expireDate
    contract.moneyAmount = req.body.price
    contract.monthlyDeadLine = req.body.monthlyDeadLine
    
    contractModel.findByIdAndUpdate(req.params.idCon, {$set: contract}, (error, data) => 
    {
        if(error){
            return next(createError(400, `Error on contract update for confirmation.`))
        }else{
            res.json(data)
        }
    })
}

const signContract = (req, res, next) => {
    let contract = new Object()
    contract.status = 'signed'
    contractModel.findByIdAndUpdate(req.params.idCon, {$set: contract}, (error, data) => 
    {
        if(error){
            return next(createError(400, `Error on contract update for signing.`))
        }else{
            res.json(data)
        }
    })
}

const completeContract = (req, res, next) => {
    let contract = new Object()
    contract.status = 'completed'
    contractModel.findByIdAndUpdate(req.params.idCon, {$set: contract}, (error, data) => 
    {
        if(error){
            return next(createError(400, `Error on contract update for completition.`))
        }else{
            req.contract = data
            return next()
        }
    })
}

const rentProperty = (req, res, next) =>{
    propertiesModel.findByIdAndUpdate(req.contract.property, {"resident": req.contract.resident}, (error, data) => 
    {
        if(error){
            return next(createError(400, `Error on property renting.`))
        }else{
            return next()
        }
    })
}

const cancelOtherContracts = (req, res, next) => {
    contractModel.remove({property: req.property._id, status: { $ne: 'completed'}}, (error, data) => 
    {
        if(error){
            return next(createError(400, `Error on contract deleting.`))
        }else{
            return res.json(req.contract)
        }
    })
}

const cancelContract = (req, res, next) => {

    contractModel.findOneAndDelete({_id: req.contract._id}, (error, data) => 
    {
        if(error){
            return next(createError(400, `Error on contract canceling.`))
        }else{
            return res.json(data)
        }
    })
}

router.get('/ContractsRequested',checkUserLogged, (req, res) => 
{
    if(req.decodedToken.accessLevel == process.env.ACCESS_LEVEL_ADMIN){
        contractModel.find({tenant: req.decodedToken.email, status: 'requested'}, (error, data) =>
        {
            if(!error){
                if(data){
                    res.json(data)
                }else{
                    res,json()
                }
            }
        })
    }else{
        contractModel.find({resident: req.decodedToken.email, status: 'requested'}, (error, data) =>
        {
            if(!error){
                if(data){
                    res.json(data)
                }else{
                    res,json()
                }
            }
        })
    }
    
})

router.get('/ContractsConfirmed', checkUserLogged, (req, res) => 
{
    contractModel.find({resident: req.decodedToken.email, status: 'confirmed'}, (error, data) =>
    {
        if(!error){
            if(data){
                res.json(data)
            }else{
                res,json()
            }
        }
    })
})

router.get('/ContractsSigned', checkUserLogged, (req, res) => 
{
    contractModel.find({tenant: req.decodedToken.email, status: 'signed'}, (error, data) =>
    {
        if(!error){
            if(data){
                res.json(data)
            }else{
                res,json()
            }
        }
    })
})

router.get('/ContractsCompleted', checkUserLogged, (req, res) => 
{
    if(req.decodedToken.accessLevel == process.env.ACCESS_LEVEL_ADMIN) {
        contractModel.find({tenant: req.decodedToken.email, status: 'completed'}, (error, data) =>
        {
            if(!error){
                if(data){
                    res.json(data)
                }else{
                    res,json()
                }
            }
        })
    }else{
        contractModel.find({resident: req.decodedToken.email, status: 'completed'}, (error, data) =>
        {
            if(!error){
                if(data){
                    res.json(data)
                }else{
                    res,json()
                }
            }
        })
    }
})

router.put('/Contracts/confirm/:idCon', upload.none(), checkUserLogged, checkContractExists, checkAvaliable, checkUserTenant, confirmContract)

router.put('/Contracts/sign/:idCon', upload.none(), checkUserLogged, checkContractExists, checkAvaliable, checkUserResident, signContract)

router.put('/Contracts/complete/:idCon', checkUserLogged, checkContractExists, checkAvaliable, checkUserTenant, completeContract, rentProperty, cancelOtherContracts)

router.delete('/Contracts/tenantCancelContract/:idCon', upload.none(), checkUserLogged, checkContractExists, checkUserTenant, cancelContract)

router.delete('/Contracts/residentCancelContract/:idCon', checkUserLogged, checkContractExists, checkUserResident, cancelContract)

module.exports = router