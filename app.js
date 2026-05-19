// require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const methodOverride = require('method-override');
const sequelize = require('./config/database');
const { User, Author, Book } = require('./models');

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Flash messages
app.use(flash());

// View engine setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Global variables for views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.session.user || null;
  next();
});



// Test database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Home page: show list of books
app.get('/', async (req, res) => {
  try {
    const books = await Book.findAll({ include: Author });
    res.render('index', { title: 'Book Library', books });
  } catch (err) {
    console.error(err);
    res.status(500).render('errors/error', {
      error: { message: 'Failed to load books.' },
      title: 'Error'
    });
  }
});

// Import routes
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const authorRoutes = require('./routes/authors');


// Use routes
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/authors', authorRoutes);

app.use((req, res, next) => {
  res.status(404).render('errors/error', {
    error: { message: 'Page Not Found' },
    title: '404 Not Found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Set default status code
  const statusCode = err.status || 500;

  // Format the error response
  res.status(statusCode).render('errors/error', {
    error: process.env.NODE_ENV === 'development' ? err : { message: 'Something went wrong!' },
    title: 'Error'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
