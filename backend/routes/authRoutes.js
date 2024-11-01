const express = require('express');
const { registerUser, loginUser, changeUserPassword, checkUserExists } = require('../controller/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('check-user', checkUserExists); 
router.post('/login', loginUser);
router.put('/change-password/:userId', changeUserPassword); // Change password route
router.get('/user/:username'
    ,getUserDetails)

// POST a new workout
// router.post('/', (req, res) => {
//     res.json({mssg: 'POST a new workout'})
//   })
  
module.exports = router;
