const express = require('express')
const cors = require('cors')
const db = require('./db')
const app = express()
const user = require('./routes/user')
const leads = require('./routes/leads')
const bodyParser = require('body-parser')
require("dotenv").config();

const port = 4500
app.use(cors())
app.use(bodyParser.json())
app.use('/', bodyParser.json());
app.use('/user', user)
app.use('/leads', leads)

app.listen(port, () => {
    console.log(`Port is running on ${port}`)
})