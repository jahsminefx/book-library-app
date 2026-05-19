const BaseController = require('./baseController');
const { Author } = require('../models');

class AuthorsController extends BaseController {
  constructor() {
    super(Author);
  }

  // Show new author form
  newForm(req, res) {
    res.render('authors/new', {
      title: 'Add New Author',
      redirectUrl: req.query.redirectUrl || ''
    });
  }

  // Create new author
  async create(req, res) {
    try {
      await Author.create(req.body);
      req.flash('success_msg', 'Author created successfully');

      const redirectUrl = req.body.redirectUrl;
      if (redirectUrl) {
        return res.redirect(redirectUrl);
      }
      res.redirect('/authors');
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Failed to create author');
      res.redirect('back');
    }
  }
}

module.exports = new AuthorsController();