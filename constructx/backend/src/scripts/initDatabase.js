const User = require('../models/User');

async function initDatabase() {
  try {
    console.log('Initializing database...');
    
    // Create tables
    await User.createTable();
    console.log('Users table created successfully');
    
    // Create default admin user
    const existingAdmin = await User.findByEmail('info@constructx.in');
    if (!existingAdmin) {
      await User.create({
        email: 'info@constructx.in',
        password: 'Admin@2025',
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        company_id: 1
      });
      console.log('Default admin user created successfully');
    } else {
      console.log('Default admin user already exists');
    }
    
    console.log('Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initDatabase();

