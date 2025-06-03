const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { check, validationResult } = require('express-validator');

// Register Page
router.get('/register', (req, res) => {
  res.render('auth/register', {
    title: 'Register',
    errors: []
  });
});

// Register Handle
router.post('/register', [
  check('username', 'Username is required').notEmpty(),
  check('email', 'Valid email is required').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/register', {
      title: 'Register',
      errors: errors.array()
    });
  }

  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      req.flash('error_msg', 'Username already taken');
      return res.redirect('/auth/register');
    }

    await User.create({ username, email, password });

    req.flash('success_msg', 'You are now registered');
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    res.status(500).render('errors/error', { error: err });
  }
});

// Login Page
router.get('/login', (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    errors: []
  });
});

// Login Handle
router.post('/login', [
  check('username', 'Username is required').notEmpty(),
  check('password', 'Password is required').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/login', {
      title: 'Login',
      errors: errors.array()
    });
  }

  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      req.flash('error_msg', 'Invalid credentials');
      return res.redirect('/auth/login');
    }

    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      req.flash('error_msg', 'Invalid credentials');
      return res.redirect('/auth/login');
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    req.flash('success_msg', 'You are now logged in');
    res.redirect('/books');
  } catch (err) {
    console.error(err);
    res.status(500).render('errors/error', { error: err });
  }
});

// Logout Handle
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;
