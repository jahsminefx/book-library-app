const BaseController = require('./baseController');
const { Book, Author } = require('../models');

class BooksController extends BaseController {
  constructor() {
    super(Book);
    this.editForm = this.editForm.bind(this);
    this.show = this.show.bind(this);
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

  sanitizeBookData(body) {
    const { title, authorId, isbn, publicationYear, description } = body;

    return {
      title,
      authorId,
      isbn: isbn || null,
      publicationYear: publicationYear ? parseInt(publicationYear, 10) : null,
      description: description || null
    };
  }

  // Override create to normalize optional fields
  async create(req, res) {
    try {
      await Book.create(this.sanitizeBookData(req.body));
      req.flash('success_msg', 'Book created successfully');
      res.redirect('/books');
    } catch (err) {
      console.error('Error creating book:', err);
      req.flash('error_msg', 'Failed to create book: ' + err.message);
      res.redirect('back');
    }
  }

  // Override show to include author details
  async show(req, res) {
    try {
      const item = await Book.findByPk(req.params.id, { include: Author });

      if (!item) {
        req.flash('error_msg', 'Book not found');
        return res.redirect('/books');
      }

      res.render('books/show', {
        item,
        title: item.title
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

  async update(req, res) {
    try {
      const book = await Book.findByPk(req.params.id);

      if (!book) {
        req.flash('error_msg', 'Book not found');
        return res.redirect('/books');
      }

      await book.update(this.sanitizeBookData(req.body));
      req.flash('success_msg', 'Book updated successfully');
      res.redirect('/books');
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Failed to update book: ' + err.message);
      res.redirect('back');
    }
  }
}

module.exports = new BooksController();
