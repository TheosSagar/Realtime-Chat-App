require('dotenv').config(); // To use code inside .env

const express = require('express');
const connectDB = require('./src/config/db')

connectDB();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Chat API running");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})