import { NavLink } from 'react-router-dom'

export default function Nav() {
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
          <NavLink className="navbar-item is-tab is-active" to="/">
            Games
          </NavLink>
          <NavLink className="navbar-item is-tab" to="/badges">
            Badges
          </NavLink>
          <NavLink className="navbar-item is-tab" to="/instructions">
            Instructions
          </NavLink>
          <NavLink className="navbar-item is-tab" to="/statements">
            Statements
          </NavLink>
          <a className="navbar-item is-tab">Logout</a>
        </div>
      </div>
    </nav>
  )
}

{
  /* <NavLink to="/">Games</NavLink>
{tasks.map((task) => (
  <NavLink key={task.name} to={task.path}>
    {task.name}
  </NavLink>
))} */
}
