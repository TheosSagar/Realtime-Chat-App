import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'

function Dashboard() {
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(true)
  const socketRef = useRef(null)
  const selectedUserRef = useRef(selectedUser)
  const messagesEndRef = useRef(null)

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const getAllUsers = async () => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch('http://localhost:5000/api/users/getUsers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setUsers(data.users)
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.log('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMessages = async (userId) => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(`http://localhost:5000/api/messages/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setMessages(data.messages)
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.log('Error fetching messages:', error)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()

    if (!messageText.trim()) return
    if (!selectedUser) return

    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        `http://localhost:5000/api/messages/send/${selectedUser._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: messageText,
          }),
        }
      )

      const data = await response.json()

      if (response.ok) {
        setMessages((prev) => [...prev, data.newMessage])
        setMessageText('')
        if (socketRef.current) {
          socketRef.current.emit('sendMessage', {
            to: selectedUser._id,
            message: data.newMessage,
          })
        }
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.log('Error sending message:', error)
    }
  }

  const handleSelectUser = (user) => {
    setSelectedUser(user)
    getMessages(user._id)
  }

  useEffect(() => {
    selectedUserRef.current = selectedUser
  }, [selectedUser])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const socket = io('http://localhost:5000', {
      auth: { token },
    })

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
    })

    socket.on('receiveMessage', (message) => {
      if (selectedUserRef.current && message.senderId === selectedUserRef.current._id) {
        setMessages((prev) => [...prev, message])
      } else {
        console.log('Incoming message for other user', message)
      }
    })

    socketRef.current = socket

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const formatMessageTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen flex-col md:flex-row">
        <div className={`${selectedUser ? 'hidden' : 'block'} w-full md:block md:w-80 border-b border-gray-200 bg-white md:border-b-0 md:border-r`}>
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900">Users</h2>

            <button
              onClick={handleLogout}
              className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Logout
            </button>
          </div>

          <div className="p-3">
            {loading && <p className="p-3 text-sm text-gray-500">Loading users...</p>}

            {!loading && users.length === 0 && (
              <p className="p-3 text-sm text-gray-500">No users found</p>
            )}

            <div className="space-y-2">
              {users.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  className={`w-full rounded-lg p-3 text-left hover:bg-gray-100 ${
                    selectedUser?._id === user._id ? 'bg-gray-100' : ''
                  }`}
                >
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`${selectedUser ? 'flex' : 'hidden'} flex-1 flex-col bg-gray-50 min-h-0 md:flex`}>
          {selectedUser ? (
            <>
              <div className="border-b border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedUser.name}
                    </h2>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 md:hidden"
                  >
                    Back
                  </button>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 min-h-0">
                {messages.length === 0 && (
                  <p className="text-center text-sm text-gray-500">
                    No messages yet
                  </p>
                )}

                {messages.map((message) => {
                  const isSelectedUserMessage = message.senderId === selectedUser._id
                  const senderName = isSelectedUserMessage ? selectedUser.name : 'You'

                  return (
                    <div
                      key={message._id}
                      className={`flex ${
                        isSelectedUserMessage ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div
                        className={`max-w-sm rounded-lg p-3 shadow-sm wrap-break-word ${
                          isSelectedUserMessage
                            ? 'bg-white text-gray-900'
                            : 'bg-gray-900 text-white'
                        }`}
                      >
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-xs font-semibold">{senderName}</span>
                          <span
                            className={`text-xs ${
                              isSelectedUserMessage ? 'text-gray-400' : 'text-gray-300'
                            }`}
                          >
                            {formatMessageTime(message.createdAt)}
                          </span>
                        </div>

                        <p className="text-sm wrap-break-word whitespace-pre-wrap">{message.text}</p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={sendMessage}
                className="flex flex-col gap-3 border-t border-gray-200 bg-white p-4 sm:flex-row"
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                />

                <button
                  type="submit"
                  className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 sm:w-auto"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">Select a user to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
