// promoteUser.js
require('dotenv').config();
const { sequelize, User } = require('./models');

const username = process.argv[2]; // Get username from command line argument
const newRole = process.argv[3] || 'admin'; // Default to 'admin' if no role specified

(async () => {
  try {
    // Find and update the user
    const [affectedRows] = await User.update(
      { role: newRole },
      { where: { username } }
    );
    
    if (affectedRows > 0) {
      console.log(`Success: ${username} is now a ${newRole}`);
    } else {
      console.log('User not found or no changes made');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
    process.exit();
  }
})(); 