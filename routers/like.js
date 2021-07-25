const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const passpoprt = require('passport');

router.get('/toggle', passpoprt.checkAuthentication, likeController.toggleLike);

module.exports = router;