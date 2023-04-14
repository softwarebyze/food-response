import { NavLink } from 'react-router-dom'
import { TrainingTask } from '../types/TrainingTask'

function Navbar({ tasks }: { tasks: TrainingTask[] }) {
  return (
    <div id="nav">
      <NavLink to="/">Home</NavLink>
      {tasks.map((task) => (
        <NavLink key={task.name} to={task.path}>
          {task.name}
        </NavLink>
      ))}
    </div>
  )
}

export default Navbar
