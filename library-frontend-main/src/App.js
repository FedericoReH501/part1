import { useState, useEffect } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import Login from "./components/LogIn"
import Notify from "./components/Notify"
import { useApolloClient, useSubscription } from "@apollo/client"
import { BOOK_ADDED } from "./queries"
import Recomended from "./components/Recomended"

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null)
  const [message, setMessage] = useState(null)
  const [selectedGenre, setSelectedGenre] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log("subription success:")
      console.log(data)
    },
  })
  useEffect(() => {
    setToken(localStorage.getItem("user-token"))
  }, [])

  const notify = (message) => {
    console.log("error :")
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
        {!token ? null : (
          <div>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recomended")}>recomended</button>
          </div>
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
      <Authors show={page === "authors"} notify={notify} />

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
