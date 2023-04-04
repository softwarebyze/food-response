import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <div>
      <NavLink to="/">Home</NavLink>
      <NavLink to="stopsignal">Stop-Signal</NavLink>
      <NavLink to="gonogo">Go/No-Go</NavLink>
    </div>
  )
}

export default Navbar
