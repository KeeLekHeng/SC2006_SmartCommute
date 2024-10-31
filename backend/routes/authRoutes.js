const express = require('express');
const { registerUser, loginUser, changeUserPassword } = require('../controller/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/change-password/:userId', changeUserPassword); // Change password route


// POST a new workout
// router.post('/', (req, res) => {
//     res.json({mssg: 'POST a new workout'})
//   })
  
module.exports = router;
