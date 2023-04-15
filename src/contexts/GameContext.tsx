import { ReactNode, createContext, useContext, useState } from 'react'
import { images } from '../data/images.json'
import { tasks } from '../data/tasks.json'
import { TaskData, TaskInfo } from '../types/Task'

interface GameContextValue {
  taskData: TaskData
  taskInfo: TaskInfo
}

const GameContext = createContext<GameContextValue>({
  taskData: images as TaskData,
  taskInfo: tasks[0] as TaskInfo,
})

export function useGame() {
  return useContext(GameContext)
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [taskData, setTaskData] = useState<TaskData>(images as TaskData)
  const [taskInfo, setTaskInfo] = useState<TaskInfo>(tasks[0] as TaskInfo)

  return (
    <GameContext.Provider value={{ taskData, taskInfo }}>
      <div className="gameWrapper">{children}</div>
    </GameContext.Provider>
  )
}
