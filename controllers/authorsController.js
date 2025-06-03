const BaseController = require('./baseController');
const { Author } = require('../models');

class AuthorsController extends BaseController {
  constructor() {
    super(Author);
  }
}

module.exports = new AuthorsController();