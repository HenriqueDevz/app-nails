import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Finances from './pages/Finances'
import Storage from './pages/Storage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/finances" element={<Finances />} />
        <Route path="/storage" element={<Storage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App