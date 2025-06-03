
// const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Author = require('./Author');
const Book = require('./Book');
const User = require('./User');
// db.Book = Book;
// Associations
Author.hasMany(Book, { foreignKey: 'authorId' });
Book.belongsTo(Author, { foreignKey: 'authorId' });
async function initializeDatabase() {
  try {
    await sequelize.sync({ force: true }); // Set force: false if you don't want to drop tables
    console.log('Database & tables created!');
    return true;
  } catch (error) {
    console.error('Failed to sync database:', error);
    return false;
  }
}
// Export all
module.exports = {
  sequelize,
  User,
  Book,
  Author,
  initializeDatabase,
};
