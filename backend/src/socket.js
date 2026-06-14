const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')

let io
const onlineUsers = new Map()

const initSocket = (server) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL,
  ].filter(Boolean)

  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) {
          return callback(null, true)
        }
        callback(new Error(`Socket CORS policy does not allow access from ${origin}`))
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  // Middleware to authenticate socket connections

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) return next(new Error('Authentication error'))

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.userId = decoded.userId
      next()
    } catch (error) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket) => {
    const userId = socket.userId
    onlineUsers.set(userId.toString(), socket.id)

    io.emit('userOnline', userId.toString())
    io.emit('onlineUsers', Array.from(onlineUsers.keys()))

    socket.on('disconnect', () => {
      onlineUsers.delete(userId.toString())
      io.emit('userOffline', userId.toString())
      io.emit('onlineUsers', Array.from(onlineUsers.keys()))
    })
  })

  return io
}

const getIo = () => io
const getOnlineUsers = () => onlineUsers

module.exports = {
  initSocket,
  getIo,
  getOnlineUsers,
}