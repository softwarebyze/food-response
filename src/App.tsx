import 'bulma/css/bulma.min.css'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Home from './components/Home'
import LoginPage from './components/LoginPage'
import Nav from './components/Nav'
import TaskPage from './components/TaskPage'
import { tasks } from './data/tasks.json'
import './main.css'
import { TaskInfo } from './types/Task'

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home tasks={tasks as TaskInfo[]} />} />
        <Route path="/login" element={<LoginPage />} />
        {tasks.map((task) => (
          <Route
            key={task.name}
            path={task.path}
            element={<TaskPage task={task as TaskInfo} />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  )
}
