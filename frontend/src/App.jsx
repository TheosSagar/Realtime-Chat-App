import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { useState } from 'react'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import ProtectedRoute from './components/ProctectedRoute.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route 
          path='/dashboard'
          element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }
        />
      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
