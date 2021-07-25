const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const homeController = require('../controllers/homeController');

router.use('/user', require('./user'));
router.use('/post', require('./post'));
router.get('/home', homeController.home);
router.use('/comment', require('./comment'));
router.use('/like', require('./like'));

router.use('/api', require('./api'));

module.exports = router;