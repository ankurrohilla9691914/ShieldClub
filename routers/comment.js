const express = require('express');
const router = express.Router();
const passport = require('passport')
const commentController = require('../controllers/commentController');

router.post('/create', commentController.createComment);

router.get('/delete/:id', passport.checkAuthentication, commentController.deleteComment);

module.exports = router;