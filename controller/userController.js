const User = require('./../model/userModel')



exports.userSignUp = async (req, res) => {
    try{
        const newUser = await User.create({...req.body, passwordChangedAt: Date.now()})
        res.status(200).json({
            status: 'success',
            data: {
                newUser
            }
        })

    }catch(err){
        res.status(404).json({
            status: 'failed',
            message:err.message
        })
    }

}

exports.getAllUser = async (req, res) => {
    try{
        const allUser = await User.find()
        res.status(200).json({
            status: 'success',
            data: {
                users: allUser
            }
        })
    }catch(err){
        res.status(404).json({
            status: 'failed',
            err: err.message
        })
    }
}

exports.deleteUserAdmin = async  (req, res) => {
    try{
        const deletedUser = await User.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: 'success',
            data: {

            }
        })

    }catch(err){
        res.status(404).json({
            status: 'failed',
            err: err.message
        })
    }
}

exports.getAUser = async (req, res) => {
    try{
        const user = await User.findById(req.params.id).populate({
            path: 'blog',
            populate: {
                path: 'title',
            }
        })
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
    }catch(err){
        res.status(404).json({
            status:'failed',
            err: err.message
        })
    }
}