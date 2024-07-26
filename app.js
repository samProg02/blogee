const express = require('express');
const cookieParser = require('cookie-parser')

const app = express();
const userRoutes = require('./routes/userRoutes')
const blogRoutes = require('./routes/blogRoutes')
app.use(express.json());
app.use(cookieParser())
app.get('/', (req, res) => {
    res.status(200).json({
        "i" : "We are live"
    })
})

app.use('/api/user', userRoutes);
app.use('/api/blogs', blogRoutes)

module.exports = app;