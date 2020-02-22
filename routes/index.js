const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const passport = require('passport');
const userController = require('../controllers/userController');

require('../lib/passport');

router.get('/', userController.home);
router.get('/auth/options', userController.authOptions);
router.get('/auth/random', userController.getRandomUsers);
router.get('/auth/movies', userController.getMovies);
router.get('/api/users/logout', userController.logout);

router.post('/api/users/register', [
  check('name', 'Name is required')
  .not()
  .isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please include a valid password').isLength({ min: 5 })
], userController.register);

router.post('/api/users/login', passport.authenticate('local-login', {
  successRedirect: '/auth/options',
  failureRedirect: '/',
  failureFlash: true
  })
);


module.exports = router;
