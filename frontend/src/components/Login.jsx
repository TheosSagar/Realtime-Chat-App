import React, { useState } from 'react'

const Login = () => {

    const [isLoginMode, setIsLoginMode] = useState(true)

  return (
    <div>
      {/* Header */}

      <div>
        <h2>{(isLoginMode ? "Login" : "Sign Up")}</h2>
      </div>

      {/* Toggle between login and signup */}

      <div>
        <button onClick={() => {setIsLoginMode(true)}}>Login</button>
        <button onClick={() => {setIsLoginMode(false)}}>Sign Up</button>
      </div>

      {/* Form Section */}

      <form action="">
        {
          !isLoginMode && (
            <input type="text" placeholder="Name" required/>
          )
        }

        {/* Shared fields */}

        <input type="email" name="" id="" placeholder='E-mail' required/>
        <input type="password" name="" id="" placeholder='Password' required/>

        {
          !isLoginMode && (
            <input type="password" name="" id="" placeholder='Confirm password' required/>
          )
        }

        <div>
          <button>{isLoginMode? 'Login' : 'Sign Up'}</button>
        </div>

        {/* Switch */}

        <p>
          {isLoginMode ? "Don't have an account?" : "Already have and account?"}
          <a href="#" onClick={() => {
            setIsLoginMode(!isLoginMode)
          }}>{isLoginMode ? "Sign Up" : "Login"}</a>
        </p>

      </form>
    </div>
  )
}

export default Login