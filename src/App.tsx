import { BrowserRouter, Route, Routes } from 'react-router-dom'
import GoNoGo from './components/GoNoGo'
import Home from './components/Home'
import Navbar from './components/Navbar'
import StopSignal from './components/StopSignal'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stopsignal" element={<StopSignal />} />
        <Route path="/gonogo" element={<GoNoGo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
