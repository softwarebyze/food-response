import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Nav() {
  const navigate = useNavigate()
  async function handleLogout() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      alert(error.message)
    } else {
      return navigate('/login')
    }
  }

  return (
    <nav className="navbar has-shadow">
      <div className="container">
        <div className="navbar-start">
          <NavLink className="navbar-item" to="/">
            <img src="https://klaugybhpmnhtpggpgtq.supabase.co/storage/v1/object/public/foodresponse/project_health_logo.webp?t=2023-06-06T20%3A31%3A01.017Z" />
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
