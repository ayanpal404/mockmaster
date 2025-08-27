const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const setCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

exports.register = async (req, res, next) => {
  try {
    // Check if database is connected
    if (!mongoose.connection.readyState) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again later.' 
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: 'Validation error', errors: errors.array() });

    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password });

    const token = generateToken({ id: user._id });
    setCookie(res, token);

    return res.status(201).json({
      message: 'User registered',
      user: { id: user._id, name: user.name, email: user.email },
      token // also return for mobile clients
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    // Check if database is connected
    if (!mongoose.connection.readyState) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again later.' 
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: 'Validation error', errors: errors.array() });

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken({ id: user._id });
    setCookie(res, token);

    return res.json({
      message: 'Logged in',
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
  res.json({ message: 'Logged out' });
};

exports.me = async (req, res, next) => {
  try {
    // req.user is populated in auth middleware
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
};
