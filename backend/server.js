const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Chat API running");
});

app.listen(5000, () => {
    console.log("Server running in port 5000");
})