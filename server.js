const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app')

dotenv.config({path: './config.env' })


const db  = process.env.DB.replace('<password>', process.env.DB_PASSWORD)


mongoose.connect(db, {




}).then(con => {
    console.log('Database connected')
})





const server = app.listen(3000, () => {
    console.log('Listening.....')
})