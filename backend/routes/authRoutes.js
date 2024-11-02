const express = require('express');
const { registerUser, loginUser, changeUserPassword, forgetPassword, getUserDetails } = require('../controller/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forget', forgetPassword); // This should be correctly defined
router.put('/change-password/:userId', changeUserPassword);
router.get('/user/:username', getUserDetails);

// POST a new workout
// router.post('/', (req, res) => {
//     res.json({mssg: 'POST a new workout'})
//   })
  
module.exports = router;