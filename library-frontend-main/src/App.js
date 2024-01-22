import { useState, useEffect } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import Login from "./components/LogIn"
import Notify from "./components/Notify"
import { useApolloClient } from "@apollo/client"
import Recomended from "./components/Recomended"

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null)
  const [message, setMessage] = useState(null)
  const [selectedGenre, setSelectedGenre] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    setToken(localStorage.getItem("user-token"))
  }, [])

  const notify = (message) => {
    setMessage(message)
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
        {!token ? null : (
          <button onClick={() => setPage("recomended")}>recomended</button>
        )}
        {!token ? (
          <button onClick={() => setPage("login")}>login</button>
        ) : (
          <button
            onClick={() => {
              setToken(null)
              localStorage.clear()
              client.resetStore()
            }}
          >
            logout
          </button>
        )}
      </div>
      <Notify message={message}></Notify>
      <Authors show={page === "authors"} />

      <Books
        show={page === "books"}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
      />

      <NewBook
        show={page === "add"}
        notify={notify}
        selectedGenre={selectedGenre}
      />
      <Recomended show={page === "recomended"}></Recomended>
      <Login show={page === "login"} setToken={setToken} notify={notify} />
    </div>
  )
}

export default App
