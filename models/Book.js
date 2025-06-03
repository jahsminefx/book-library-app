const { DataTypes } = require('sequelize');
const { Model } = require('sequelize');
const sequelize = require('../config/database');
const Author = require('./Author');

const Book = sequelize.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    authorId: {
        type: DataTypes.INTEGER,
        references: {
            model: Author,
            key: 'id'
        },
        allowNull: false
    }
}, {
    timestamps: true
});

// Define Relationship
Book.belongsTo(Author, { foreignKey: 'authorId' });

module.exports = Book; 