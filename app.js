const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const contactsRoutes = require('./routes/contacts');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas
const mongoURI = 'mongodb+srv://kashyappatel326:Kashyap0702@cluster0.00hrwfk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB Atlas connection string

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((err) => {
  console.error('MongoDB connection error', err);
});

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/contacts', contactsRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Contact List API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
