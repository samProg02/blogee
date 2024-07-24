const express = require('express')
const userController = require('./../controller/userController')
const router = express.Router()

router.route('/sign-up').post(userController.userSignUp);
router.route('/').get(userController.getAllUser);
router.route('/:id').delete(userController.deleteUserAdmin).get(userController.getAUser);
module.exports = router;