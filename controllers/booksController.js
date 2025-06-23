const BaseController = require('./baseController');
const { Book, Author } = require('../models');

class BooksController extends BaseController {
  constructor() {
    super(Book);
    console.log('Controller initialized with model:', this.model?.name); 
  }

  // Override newForm to include authors
  async newForm(req, res) {
    try {
      const authors = await Author.findAll();
      res.render('books/new', {
        authors,
        title: 'New Book'
      });
    } catch (err) {
      console.error(err);
      res.status(500).render('errors/error', { error: err });
    }
  }

  // Override editForm to include authors
  async editForm(req, res) {
    try {
      const [book, authors] = await Promise.all([
        Book.findByPk(req.params.id),
        Author.findAll()
      ]);
      
      if (!book) {
        req.flash('error_msg', 'Book not found');
        return res.redirect('/books');
      }
      
      res.render('books/edit', {
        book,
        authors,
        title: 'Edit Book'
      });
    } catch (err) {
      console.error(err);
      res.status(500).render('errors/error', { error: err });
    }
  }
}

module.exports = new BooksController();