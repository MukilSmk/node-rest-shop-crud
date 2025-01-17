const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')

mongoose.connect('mongodb://127.0.0.1:27017/products-order-api', {
    useNewUrlParser: true})

app.use(morgan('dev'))

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-requested-With, Content-Type, Accept, Authorization')
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)


app.use( (req, res, next)=>{
    const error = new Error('Not found')
    error.status= 404
    next(error)
})

app.use( (error, req, res, next)=>{
res.status(error.status || 500)

res.json({
    status:{
        status: false
    },
    error:{
        message: error.message
    }
})
})


module.exports = app;