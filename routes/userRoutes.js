const express = require('express')
const userController = require('./../controller/userController')
const authController = require('./../controller/authController')
const router = express.Router()

router.route('/sign-up').post(userController.userSignUp);
router.route('/').get(userController.getAllUser);
router.post('/login', authController.login)
router.route('/:id').delete(userController.deleteUserAdmin).get(userController.getAUser);
module.exports = router;