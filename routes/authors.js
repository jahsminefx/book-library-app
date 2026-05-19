const express = require('express');
const router = express.Router();
const authorsController = require('../controllers/authorsController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/', authorsController.list);
router.get('/new', isAuthenticated, isAdmin, authorsController.newForm);
router.post('/', isAuthenticated, isAdmin, authorsController.create);
router.get('/:id', authorsController.show);
router.get('/:id/edit', isAuthenticated, isAdmin, authorsController.editForm);
router.put('/:id', isAuthenticated, isAdmin, authorsController.update);
router.delete('/:id', isAuthenticated, isAdmin, authorsController.delete);

module.exports = router;
