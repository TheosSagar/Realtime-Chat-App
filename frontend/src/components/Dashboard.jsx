import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const getAllUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/getUsers')

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
                  onClick={() => setSelectedUser(user)}
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
                <h2 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h2>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>

              <div className="flex flex-1 items-center justify-center p-4">
                <p className="text-sm text-gray-500">Chat with {selectedUser.name}</p>
              </div>

              <form className="flex gap-3 border-t border-gray-200 bg-white p-4">
                <input
                  type="text"
                  placeholder="Type a message..."
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
