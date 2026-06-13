import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(true)

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
        setMessages([...messages, data.newMessage])
        setMessageText('')
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
      <div className="flex h-screen">
        <div className="w-80 border-r border-gray-200 bg-white">
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

        <div className="flex flex-1 flex-col bg-gray-50">
          {selectedUser ? (
            <>
              <div className="border-b border-gray-200 bg-white p-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedUser.name}
                </h2>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>

              <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
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
                        className={`max-w-sm rounded-lg p-3 shadow-sm break-words ${
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

                        <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <form
                onSubmit={sendMessage}
                className="flex gap-3 border-t border-gray-200 bg-white p-4"
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-gray-900"
                />

                <button
                  type="submit"
                  className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800"
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
