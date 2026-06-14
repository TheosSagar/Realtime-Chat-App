import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [message, setMessage] = useState('')

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200'

  const tabClass =
    'rounded-md py-2 text-sm font-medium transition'

  const submitButtonClass =
    'w-full rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700'

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const url = isLoginMode
      ? `${import.meta.env.VITE_API_URL}/api/auth/login`
      : `${import.meta.env.VITE_API_URL}/api/auth/signup`

    const bodyData = isLoginMode
      ? {
          email: formData.email,
          password: formData.password,
        }
      : formData

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Something went wrong')
        return
      }

      setMessage(data.message)

      if (data.token) {
        localStorage.setItem('token', data.token)
        navigate('/dashboard')
      }
    } catch (error) {
      setMessage('Cannot connect to server')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl"
        onSubmit={handleSubmit}
      >
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {isLoginMode ? 'Login' : 'Sign Up'}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {isLoginMode ? 'Welcome back to your chat.' : 'Create your chat account.'}
          </p>
        </div>

        {/* Toggle between login and signup */}

        <div className="mb-6 grid grid-cols-2 rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setIsLoginMode(true)}
            className={`${tabClass} ${
              isLoginMode ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsLoginMode(false)}
            className={`${tabClass} ${
              !isLoginMode ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="space-y-4">
          {!isLoginMode && (
            <input
              className={inputClass}
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}

          {/* Shared fields */}

          <input
            className={inputClass}
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className={inputClass}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {!isLoginMode && (
            <input
              className={inputClass}
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}

          {message && (
            <p className="text-center text-sm text-gray-600">
              {message}
            </p>
          )}

          <button className={submitButtonClass} type="submit">
            {isLoginMode ? 'Login' : 'Sign Up'}
          </button>
        </div>

        {/* Switch */}

        <p className="mt-6 text-center text-sm text-gray-600">
          {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
          <button
            type="button"
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="ml-1 font-medium text-purple-600 hover:text-purple-700"
          >
            {isLoginMode ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </form>
    </div>
  )
}

export default Login
