const dns = require('node:dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/when2go';

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const tripRoutes = require('./routes/tripRoutes');
app.use('/api/trips', tripRoutes);

const weatherRoutes = require("./routes/weatherRoutes");
app.use("/api/weather", weatherRoutes);

const recommendationRoutes = require('./routes/recommendationRoutes');
app.use('/api/recommendations', recommendationRoutes);



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



