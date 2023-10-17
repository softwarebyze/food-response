import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useState } from 'react'

export default function Nav() {
  const [showMobileNav, setShowMobileNav] = useState(false)
  const navigate = useNavigate()
  async function handleLogout() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      alert(error.message)
    } else {
      return navigate('/login')
    }
  }
  const toggleMobileNav = () => setShowMobileNav((prevShow) => !prevShow)

  return (
    <nav
      className="navbar has-shadow"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-start navbar-brand">
        <NavLink className="navbar-item" to="/">
          <img src="project_health_logo.webp" />
        </NavLink>
        <span
          role="button"
          className={`navbar-burger navbar-toggle ${
            showMobileNav ? 'is-active' : ''
          }`}
          aria-label="menu"
          aria-expanded="true"
          data-target="navbarMenu"
          onClick={toggleMobileNav}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </span>
      </div>
      <div
        id="navbarMenu"
        className={`navbar-end navbar-menu ${showMobileNav ? 'is-active' : ''}`}
      >
        <NavLink
          className={({ isActive }) =>
            `${isActive ? 'is-active' : ''} navbar-item is-tab`
          }
          to="/"
        >
          Games
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${isActive ? 'is-active' : ''} navbar-item is-tab`
          }
          to="/badges"
        >
          Badges
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${isActive ? 'is-active' : ''} navbar-item is-tab`
          }
          to="/instructions"
        >
          Instructions
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${isActive ? 'is-active' : ''} navbar-item is-tab`
          }
          to="/statements"
        >
          Statements
        </NavLink>
        <a onClick={handleLogout} className="navbar-item">
          Logout
        </a>
      </div>
    </nav>
  )
}
