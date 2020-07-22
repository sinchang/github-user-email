import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const handleFetchEmail = () => {
    fetch(`https://api.github.com/users/${userName}/events/public`)
      .then((res) => res.json())
      .then((events) => {
        for (let i = 0; i < events.length; i++) {
          const event = events[i]

          if (event.type === 'PushEvent') {
            const {
              payload: { commits },
              actor: { login },
            } = event

            for (let j = 0; j < commits.length; j++) {
              const commit = commits[j]
              const {
                author: { email },
              } = commit

              const isGithubOfficalEmail =
                email.indexOf('noreply.github.com') > -1

              if (
                login.toLowerCase() === userName.toLowerCase() &&
                !isGithubOfficalEmail
              ) {
                setUserEmail(email)
                break
              }
            }
          }
        }
      })
  }

  return (
    <div className='container'>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <input
          placeholder='GitHub User Name'
          onChange={(e) => {
            setUserName(e.target.value)
          }}
        ></input>
        <button type='button' onClick={handleFetchEmail}>
          Search
        </button>
        <p>{userEmail}</p>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
