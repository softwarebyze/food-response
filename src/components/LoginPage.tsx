export default function LoginPage() {
  return (
    <div>
      <section>
        <div className="container scale-in-center">
          <div className="columns is-desktop">
            <div className="column is-half is-offset-one-quarter">
              <p style={{ textAlign: 'center' }}>
                <img
                  className="logo is-vcentered"
                  src="https://projecthealthori.org/file/repo/logo.png"
                  style={{ maxWidth: '600px', width: '80%', marginTop: '25px' }}
                />
              </p>
              <div className="box" style={{ margin: '0.7em' }}>
                <form>
                  <p className="control">
                    <input
                      className="input"
                      placeholder="Username"
                      type="text"
                    />
                  </p>
                  <br />
                  <p className="control">
                    <input
                      className="input"
                      placeholder="Password"
                      type="password"
                    />
                  </p>
                  <hr />
                  <p className="control">
                    <button
                      className="button is-fullwidth is-success"
                      type="submit"
                    >
                      Let's Go!
                    </button>
                  </p>
                </form>
              </div>
              <h4
                className="is-4 subtitle is-centered"
                style={{ textAlign: 'center' }}
              >
                <strong>
                  Not already a member of the Project Health study?
                </strong>
                <br />
                Click{' '}
                <a
                  href="https://ori.qualtrics.com/jfe/form/SV_6fKk68N8gugEoT3"
                  target="_blank"
                >
                  here
                </a>{' '}
                to see if you're eligible to participate!
                <br />
              </h4>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
