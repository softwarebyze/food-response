import { BrowserRouter, Route, Routes } from 'react-router-dom'
import GoNoGo from './GoNoGo'
import Home from './Home'
import Navbar from './Navbar'
import StopSignal from './StopSignal'

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
