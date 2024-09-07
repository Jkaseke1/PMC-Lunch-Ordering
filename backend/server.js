
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Import the connectDB function

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB using the URI from the .env file
connectDB(); // Call the connectDB function

// Import routes
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Import admin routes
const userRoutes = require('./routes/userRoutes'); // Import user routes

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes); // Use admin routes
app.use('/api/users', userRoutes); // Use user routes

// Define the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
