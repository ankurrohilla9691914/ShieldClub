const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const passport = require('passport')

router.post('/create-post', passport.checkAuthentication,postController.createPost);
router.get('/new-post', passport.checkAuthentication, postController.newPost);
router.get('/delete/:id', passport.checkAuthentication, postController.deletePost);

module.exports = router;