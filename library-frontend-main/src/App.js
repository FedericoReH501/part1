import { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import Login from "./components/LogIn"
import Notify from "./components/Notify"

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null)
  const [message, setMessage] = useState(null)

  const notify = (message) => {
    setMessage(message)
    console.log("errore")
    setTimeout(() => {
      setMessage(null)
    }, 2000)
  }
  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        {!token ? (
          <button onClick={() => setPage("login")}>login</button>
        ) : (
          <button
            onClick={() => {
              setToken(null)
              console.log("logut!")
            }}
          >
            logout
          </button>
        )}
      </div>
      <Notify message={message}></Notify>
      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />
      <Login show={page === "login"} setToken={setToken} notify={notify} />
    </div>
  )
}

export default App
