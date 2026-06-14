const Message = require('../models/Message')
const { getIo, getOnlineUsers } = require('../socket')

// Send message
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id
    const { receiverId } = req.params
    const { text } = req.body

    if (!text) {
      return res.status(400).json({
        message: 'Message text is required',
      })
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
    })

    const onlineUsers = getOnlineUsers()
    const receiverSocketId = onlineUsers.get(receiverId.toString())

    if (receiverSocketId) {
      const io = getIo()
      io.to(receiverSocketId).emit('receiveMessage', newMessage)
    }

    res.status(201).json({
      message: 'Message sent successfully',
      newMessage,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
    })
  }
}

// get message
const getMessages = async (req, res) => {
  try {
    const loggedInUserId = req.user._id
    const { receiverId } = req.params

    const messages = await Message.find({
      $or: [ // find msg from both sides eg: sender: 111 reciver: 222 finds the messages and even if the sender becomes 222 and reciver 111 the msg is found
        {
          senderId: loggedInUserId,
          receiverId: receiverId,
        },
        {
          senderId: receiverId,
          receiverId: loggedInUserId,
        },
      ],
    }).sort({ createdAt: 1 })

    res.status(200).json({
      message: 'Messages fetched successfully',
      messages,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
    })
  }
}

module.exports = {
  sendMessage,
  getMessages,
}