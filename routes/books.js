const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');
const BaseController = require('../controllers/baseController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { Book, Author } = require('../models');


// Get all books
// GET /books
router.post('/', booksController.create.bind(booksController)); 
router.get('/', async (req, res) => {
    try {
      const books = await Book.findAll({ include: 'Author' });
      res.render('books/list', { books });
    } catch (error) {
      res.render('errors/error', { error });
    }
  });
  
// Show form to create new book
router.get('/new', isAuthenticated, isAdmin, booksController.newForm);

// Create new book
router.post('/', isAuthenticated, isAdmin, booksController.create);

// Show book details

router.get('/:id', booksController.show);

// GET /books/'/:id/edit', - Show edit form
// routes/books.js
router.get('/:id/edit', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    const authors = await Author.findAll();

    if (!book) {
      return res.status(404).render('errors/error', { error: 'Book not found' });
    }

    res.render('books/edit', { book, authors });
  } catch (err) {
    console.error(err);
    res.status(500).render('errors/error', { error: 'Server error' });
  }
});


// Update book
router.put('/:id', isAuthenticated, isAdmin, booksController.update);

// Delete book
router.delete('/:id', isAuthenticated, isAdmin, booksController.delete);

module.exports = router;
