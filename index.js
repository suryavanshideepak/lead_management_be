const express = require('express')
const cors = require('cors')
const app = express()
const user = require('./routes/user')
const db = require('./db')
const bodyParser = require('body-parser')

const port = 4500
app.use(cors())
app.use(bodyParser.json())
app.use('/', bodyParser.json());
app.use('/user',user)

app.listen(port,() => {
    console.log(`Port is running on ${port}`)
})