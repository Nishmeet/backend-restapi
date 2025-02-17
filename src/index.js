const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Add this to debug Firebase initialization
const db = require('./config/firebase');
console.log('Firebase initialized successfully');

const homeRoutes = require('./routes/homeRoutes');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes=require('./routes/expenseRoutes')

const errorHandler = require('./middleware/errorHandler');
const incomeRoutes=require('./routes/incomeRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());



// Routes
app.use('/income',incomeRoutes)
app.use('/expenses', expenseRoutes);
app.use('/', homeRoutes);
app.use('/users', userRoutes);



// Error handling middleware
app.use(errorHandler);

app.listen(port, () => console.log(`MyServer running on port ${port}`))
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Please free the port or change the port in the configuration.`);
      process.exit(1); // Exit the process with an error code
    } else {
      console.error('Server error:', err);
    }
  });