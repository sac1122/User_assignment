const express = require('express');
const router = express.Router();
const User = require('./user.model');
const { body, validationResult } = require('express-validator');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({createdOn : -1});
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user by ID
router.get('/user-detail', async (req, res) => {
  try {
    const userId = req.query._id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new user
router.post('/add-user', [
  body('name').isString().notEmpty().withMessage('Name must be a non-empty string'),
  body('interest').isArray().withMessage('Interest must be an array').notEmpty().withMessage('Interest array must not be empty'),
  body('age').isInt({ min: 0 }).withMessage('Age must be a positive integer'),
  body('mobile').isNumeric().withMessage('Mobile number must be numeric'),
  body('email').isEmail().withMessage('Invalid email address')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {

    const getUser = await User.findOne({email:req.body.email?.toLowerCase()});

    if(getUser){
     return res.status(500).json({ message: "User with same email address aldready exists." });
    }

    const user = new User({
      name: req.body.name,
      interest: req.body.interest,
      age: req.body.age,
      mobile: req.body.mobile,
      email: req.body.email?.toLowerCase()
    });
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a user
router.put('/update-user', [
  body('_id').isMongoId().withMessage('Invalid user ID'),
  body('name').optional().isString().notEmpty().withMessage('Name must be a non-empty string'),
  body('interest').optional().isArray().withMessage('Interest must be an array').notEmpty().withMessage('Interest array must not be empty'),
  body('age').optional().isInt({ min: 0 }).withMessage('Age must be a positive integer'),
  body('mobile').optional().isNumeric().withMessage('Mobile number must be numeric'),
  body('email').optional().isEmail().withMessage('Invalid email address')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.body._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.interest = req.body.interest || user.interest;
    user.age = req.body.age || user.age;
    user.mobile = req.body.mobile || user.mobile;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

  

// Delete a user
router.delete('/delete-user',  async (req, res) => {
    const userId = req.query._id;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      await user.deleteOne({_id:req.query._id})
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

module.exports = router;
