const User = require('./../model/userModel');
const jwt = require('jsonwebtoken');
const {promisify} = require('util')
const cookieOptions = {
httpOnly: true
}

exports.login = async (req, res) =>{
    try{
        const {email, password} = req.body

        if (!email || !password) {
            throw new Error('Please provide an email and password');
        }

        const newUser = await User.findOne({email: email}).select('+password');

        if (!newUser || !(await newUser.correctPassword(password, newUser.password))) {
            throw new Error('You have input a wrong password or email');
        }



        const token = await jwt.sign({id: newUser._id}, process.env.PRIVATE_KEY, {
            expiresIn: process.env.EXPIRES_IN
        });
        res.cookie('jwt', token, cookieOptions)
        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        })
    }catch(err){
        res.status(400).json({
            status: 'failed',
            err: err.message
        })
    }
}


exports.protect = async (req, res, next) => {
    try{
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookie.jwt) {
            token = req.cookie.jwt;
        }

        if (!token) throw new Error('You\'re no tlogged in')
        const decoded = await promisify(jwt.verify)(token, process.env.PRIVATE_KEY)

        const user = await User.findById(decoded.id);
        if(!user) throw new Error('This user does not exist')
        if(user.passwordChanged(decoded.iat)) throw new Error('Password has been changed before try logging in again')
        req.user = user;

    }catch(err){
        res.status(400).json({
            status: 'fail',
            err: err.message,
        })

    }

    next()
}

