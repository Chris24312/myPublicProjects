import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import { registerSchema, loginSchema } from './validation.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, name });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ message: 'Success', token });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ message: 'Success', token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
