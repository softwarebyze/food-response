import { NavLink, useNavigate } from 'react-router-dom'

export default function Nav() {
  const navigate = useNavigate()

  function handleLogout() {
    navigate('/login')
  }

  return (
    <nav className="navbar has-shadow">
      <div className="container">
        <div className="navbar-start">
          <NavLink className="navbar-item" to="/">
            <img src="https://projecthealthori.org/file/repo/logo.png" />
          </NavLink>
        </div>
        <span className="navbar-toggle">
          <span></span>
          <span></span>
          <span></span>
        </span>
        <div id="navbar-menu" className="navbar-end navbar-menu">
          <NavLink
            className={({ isActive }) =>
              `${isActive && 'is-active'} navbar-item is-tab`
            }
            to="/"
          >
            Games
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${isActive && 'is-active'} navbar-item is-tab`
            }
            to="/badges"
          >
            Badges
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${isActive && 'is-active'} navbar-item is-tab`
            }
            to="/instructions"
          >
            Instructions
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${isActive && 'is-active'} navbar-item is-tab`
            }
            to="/statements"
          >
            Statements
          </NavLink>
          <a onClick={handleLogout} className="navbar-item is-tab">
            Logout
          </a>
        </div>
      </div>
    </nav>
  )
}
