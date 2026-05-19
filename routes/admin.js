const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { User } = require('../models');

// Admin middleware (protects all routes below)
router.use((req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    req.flash('error_msg', 'Admin access required');
    return res.redirect('/auth/login');
  }
  next();
});

// Role update endpoint
router.post('/users/:id/role',
  [
    check('newRole').isIn(['admin', 'moderator', 'user'])
      .withMessage('Invalid role specified')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error_msg', errors.array()[0].msg);
      return res.redirect('/admin/users');
    }

    try {
      await User.update(
        { role: req.body.newRole },
        { where: { id: req.params.id } }
      );
      req.flash('success_msg', 'Role updated successfully');
    } catch (error) {
      req.flash('error_msg', 'Failed to update role');
      console.error('Role update error:', error);
    }
    
    res.redirect('/admin/users');
  }
);

// Users management page
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    res.render('admin/users', { title: 'User Management', users });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).render('errors/error', { error });
  }
});

module.exports = router;
