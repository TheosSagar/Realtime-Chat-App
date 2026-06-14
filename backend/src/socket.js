const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')

let io
const onlineUsers = new Map()

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'realtime-chat-app-two-alpha.vercel.app'],
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