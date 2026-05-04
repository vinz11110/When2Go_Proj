require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.use(cors());
app.use(express.json());

/* can't connect to database, need to fix later
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
    console.log("Successfully connected to MongoDB");
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB", error);
    })
*/
app.get('/api/test', (req, res) => {
    res.status(200).json({
        sucess: true,
        message: "Welcome to When2Go. The server is running"
    });
});

app.listen(PORT, () => {
    console.log(`When2Go Server is running on http://localhost:${PORT}`);
});

