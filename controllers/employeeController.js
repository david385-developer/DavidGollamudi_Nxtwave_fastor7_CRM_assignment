// controllers/employeeController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Employee } = require('../models');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = await Employee.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'Employee registered successfully', employeeId: employee.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    console.log('Attempting to find employee with email:', email);
    const employee = await Employee.findOne({ where: { email } });
    
    if (!employee) {
      console.log('No employee found with email:', email);
      return res.status(401).json({ message: 'Invalid credentials - User not found' });
    }

    console.log('Employee found, verifying password');
    const isMatch = await bcrypt.compare(password, employee.password);
    
    if (!isMatch) {
      console.log('Password verification failed');
      return res.status(401).json({ message: 'Invalid credentials - Password incorrect' });
    }

    if (!process.env.JWT_SECRET) {
      console.log('JWT_SECRET not found in environment variables');
      return res.status(500).json({ message: 'JWT_SECRET is not configured' });
    }

    console.log('Creating JWT token');
    const token = jwt.sign(
      { id: employee.id, email: employee.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    console.log('Login successful');
    return res.json({ 
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: employee.id,
          name: employee.name,
          email: employee.email
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: error.stack 
    });
  }
};

module.exports = { register, login };