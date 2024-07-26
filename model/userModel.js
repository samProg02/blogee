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
        select: false,
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
    passwordChangedAt: {
        type: Date,
        required: true,
    },
    blog: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog' // Referencing the User model
    }]

});

//
// userSchema.pre(/find/, function(next){
//     this.populate({
//         path: 'blog',
//         select: '-user'
//     })
//     next();
// })


userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next()
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}
userSchema.methods.passwordChanged = function(JWTTimeStamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000, 10);
        return JWTTimestamp < changedTimeStamp;

    }
   return false
}
const user = mongoose.model('User', userSchema);



module.exports = user;