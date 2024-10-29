require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

//const travelRoutes = require('./routes/travel')

//express app
const app = express()


//middleware (to get request info in backend)
app.use(express.json())

app.use((req,res,next) => {
    console.log(req.path, req.method)
    next()
})

//routes
//app.use('/api/travel', travelRoutes)

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected to databse")

        //listen to port
        app.listen(process.env.PORT, () => {
            console.log("listening for request on port", process.env.PORT)
        })
    })
    .catch((err) => {
        console.log(err)
    })