const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes')

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'realtime-chat-app-two-alpha.vercel.app'
    ],
    credentials: true,
  })
)

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Chat API running');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes)

module.exports = app;