const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = {
  showRegisterForm(req, res) {
    res.render('auth/register', { title: 'Register' });
  },

  async register(req, res) {
    const { username, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        req.flash('error_msg', 'Email already registered');
        return res.redirect('/auth/register');
      }

      await User.create({ username, email, password });
      req.flash('success_msg', 'Registration successful. Please log in.');
      res.redirect('/auth/login');
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Registration failed');
      res.redirect('/auth/register');
    }
  },

  showLoginForm(req, res) {
    res.render('auth/login', { title: 'Login' });
  },

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user || !(await user.isValidPassword(password))) {
        req.flash('error_msg', 'Invalid email or password');
        return res.redirect('/auth/login');
      }

      req.session.userId = user.id;
      req.flash('success_msg', 'Login successful');
      res.redirect('/');
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Login failed');
      res.redirect('/auth/login');
    }
  },

  logout(req, res) {
    req.session.destroy(err => {
      if (err) console.error(err);
      res.redirect('/auth/login');
    });
  }
};
