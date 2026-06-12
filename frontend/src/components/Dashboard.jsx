import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

function Dashboard() {

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }

  return (
    <button onClick={handleLogout}>Logout</button>
  )
}

export default Dashboard