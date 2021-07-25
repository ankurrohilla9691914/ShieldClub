const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const passport = require('passport');
const User = require('../models/user');

router.get('/sign-in', UserController.SignIn);

router.post('/sendOTP', UserController.sendOTP);
router.get('/sign-up', UserController.SignUp);

router.post('/create', UserController.create);

router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect : '/user/sign-in'}
),UserController.createSession);

router.get('/profile/:id', passport.checkAuthentication, UserController.profile);

router.get('/sign-out', UserController.SignOut);

router.post('/update', UserController.UpdateProfile);
router.get('/myrequests', passport.checkAuthentication, UserController.myRequests);
router.get('/search', passport.checkAuthentication, UserController.search);
router.post('/searchUser', passport.checkAuthentication, UserController.searchUsers);
router.get('/setting', passport.checkAuthentication, UserController.setting);
router.post('/updatePassword', passport.checkAuthentication, UserController.updatePassword);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), UserController.createSession);

router.get('/modify-friendship/:id', passport.checkAuthentication, UserController.modifyFriendship);
router.get('/deleteRequest/:id', passport.checkAuthentication, UserController.deleteRequest);

module.exports = router;