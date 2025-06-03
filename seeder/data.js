const { User, Author, Book, initializeDatabase } = require('../models');

async function seedInitialData() {
  // First sync the database
  const dbReady = await initializeDatabase();
  if (!dbReady) {
    console.error('Database initialization failed');
    return;
  }

  try {
    // Create admin user
    await User.create({
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      email:'jjj@gmail.com'
    });
    // Check immediately after creation
console.log(adminUser.role); // Should log "admin"

    // Create regular user
    await User.create({
      username: 'user1',
      password: 'user123',
      role: 'user',
      email:'jjjj@gmail.com'
    });

    // Create authors
    const author1 = await Author.create({
      name: 'J.K. Rowling',
      bio: 'British author best known for the Harry Potter series'
    });

    const author2 = await Author.create({
      name: 'George R.R. Martin',
      bio: 'American novelist and short-story writer'
    });

    // Create books
    await Book.create({
      title: 'Harry Potter and the Philosopher\'s Stone',
      isbn: '9780747532743',
      publicationYear: 1997,
      authorId: author1.id
    });

    await Book.create({
      title: 'A Game of Thrones',
      isbn: '9780553103540',
      publicationYear: 1996,
      authorId: author2.id
    });

    console.log('Initial data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seedInitialData();