const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/options', userController.authOptions);
router.get('/random', userController.getRandomUsers);
router.get('/movies', userController.getMovies);

module.exports = router;
