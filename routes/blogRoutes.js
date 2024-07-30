const express = require('express');
const blogController = require('./../controller/blogController')
const authController = require('./../controller/authController')

const router = express.Router();

router.route('/').get(blogController.getAllBlog)
router.route('/:id').get(blogController.getAPost).delete(authController.protect,blogController.deletePost).patch(authController.protect, blogController.updateBlog)

router.post('/post-blog',authController.protect, blogController.postBlog)




module.exports = router;