const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Your blog must have title or topic and must be unique from the ones we have'],
        unique: true,
    },
    category: {
        type: [String],
        required: [true, 'let us know the category of your blog']
    },
    content: {
        type: String,
        required: true,

    },
    source: {
        type: [String],
        required:[true, 'We need to know your source for confirmation']
    },
    createdAt:{
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' ,// Referencing the User model
        required: true
    }

})

blogSchema.pre(/^find/, function (next){
    this.populate({
        path: 'user', select:'-__v -passwordChangedAt -user'
    })
    next();
})
const blogModel = mongoose.model('Blog', blogSchema)
module.exports = blogModel;