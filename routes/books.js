const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { Book, Author } = require('../models');

router.get('/', async (req, res) => {
  try {
    const books = await Book.findAll({ include: Author });
    res.render('books/list', { books });
  } catch (error) {
    res.render('errors/error', { error });
  }
});

// Show form to create new book
router.get('/new', isAuthenticated, isAdmin, booksController.newForm);

// Create new book
router.post('/', isAuthenticated, isAdmin, booksController.create);

router.get('/:id', booksController.show);

router.get('/:id/edit', isAuthenticated, isAdmin, booksController.editForm);


// Update book
router.put('/:id', isAuthenticated, isAdmin, booksController.update);

// Delete book
router.delete('/:id', isAuthenticated, isAdmin, booksController.delete);

module.exports = router;
