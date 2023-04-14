import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Navbar from './components/Navbar'
import TaskPage from './components/TaskPage'
import { tasks } from './data/tasks.json'
import { TrainingTask } from './types/TrainingTask'

function App() {
  return (
    <BrowserRouter>
      <Navbar tasks={tasks as TrainingTask[]} />
      <Routes>
        <Route path="/" element={<Home />} />
        {tasks.map((task) => (
          <Route
            key={task.name}
            path={task.path}
            element={<TaskPage task={task as TrainingTask} />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  )
}

export default App
