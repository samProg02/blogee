const mongoose = require('mongoose');
// const validator = require('validator')
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        lowercase: true,
        // unique: true,

        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: 'Please enter a valid email address'
            }


    },
    password:{
        type: String,
        required: true,
    },
    passwordConfirm: {
        validate: {
            validator: function (el){
                return el === this.password
            },
            message: 'Unmatched Password'
        },
        type: String,
        required:true
    },

});


userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

})

const user = mongoose.model('User', userSchema);



module.exports = user;