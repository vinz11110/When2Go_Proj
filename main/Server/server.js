require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);



const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/when2go';

mongoose.connect(dbURI)
    .then(() => {
        console.log("Successfully connected to MongoDB");
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB: " + error.message);
    })

const clientPath = path.join(__dirname, '../Client');
console.log("Looking for HTML files in:", clientPath);
app.use(express.static(clientPath));

app.listen(PORT, () => {
    console.log(`When2Go Server is running on http://localhost:${PORT}`);
});


const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const tripRoutes = require('./routes/tripRoutes');
app.use('/api/trips', tripRoutes);

