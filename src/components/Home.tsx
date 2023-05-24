import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { TaskInfo } from '../types/Task'

export default function Home({ tasks }: { tasks: TaskInfo[] }) {
  const { session } = useAuth()
  return (
    <section className="hero is-primary">
      <div className="hero-body">
        <div className="container">
          <h1 className="title is-1">
            Welcome,{' '}
            {
              <Link className="hover-underline is-italic" to="/user">
                {session?.user?.email?.split('@')[0]}
              </Link>
            }
          </h1>
          <div className="columns">
            {tasks.map(({ name, path, cover }) => (
              <div key={name} className="column">
                <Link to={path}>
                  <div className="card" style={{ borderRadius: '1em' }}>
                    <div className="card-image">
                      <figure className="image is-4by3">
                        <img src={cover} alt={name} />
                      </figure>
                    </div>
                    <div className="card-content">
                      <div className="media">
                        <div className="media-content">
                          <strong>{name}</strong>
                        </div>
                      </div>
                      <div className="content"></div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
