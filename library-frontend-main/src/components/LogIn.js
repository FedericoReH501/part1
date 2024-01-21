import { useState, useEffect } from "react"
import { gql, useMutation } from "@apollo/client"

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

const Login = ({ setToken, notify, show }) => {
  const [username, setUsername] = useState("")
  const [password, setpassword] = useState("")

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
      notify(error.graphQLErrors[0].message)
    },
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem("user-token", token)
    }
  }, [result.data])

  const logIn = async (e) => {
    e.preventDefault()
    const result = await login({ variables: { username, password } })
    setUsername("")
    setpassword("")
  }
  if (show) {
    return (
      <div>
        <form onSubmit={logIn}>
          <div>
            username:
            <input
              type="username"
              label="username"
              onChange={({ target }) => setUsername(target.value)}
            ></input>
          </div>
          <div>
            password:
            <input
              type="password"
              onChange={({ target }) => setpassword(target.value)}
            ></input>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    )
  }
}
export default Login
