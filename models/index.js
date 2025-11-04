// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

// Import model definitions
const EmployeeModel = require('./employee');
const EnquiryModel = require('./enquiry');

// Initialize models with sequelize instance
const Employee = EmployeeModel(sequelize, DataTypes);
const Enquiry = EnquiryModel(sequelize, DataTypes);

// Define associations
Employee.hasMany(Enquiry, { foreignKey: 'counselorId', onDelete: 'SET NULL' });
Enquiry.belongsTo(Employee, { foreignKey: 'counselorId' });

// Sync database (for development)
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // Forcing recreation of tables
    console.log('Database synced successfully.');

    // Create a test user
    const hashedPassword = await bcrypt.hash('test123', 10);
    await Employee.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword
    });
    
    console.log('Test user created successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  Employee,
  Enquiry,
  syncDatabase
};