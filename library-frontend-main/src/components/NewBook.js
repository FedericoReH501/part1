import { useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import Select from "react-select"
import { ALL_AUTHORS, ALL_BOOKS, ADD_BOOK, EDIT_AUTHOR } from "../queries"

const NewBook = ({ notify, show, selectedGenre }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [published, setPublished] = useState("")
  const [genre, setGenre] = useState("")
  const [genres, setGenres] = useState([])
  const [name, setName] = useState("")
  const [born, setBorn] = useState("")

  const [newBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }],
    onError: (error) => {
      console.log("'why i'm here'")
      console.log(error)
      notify(error.graphQLErrors[0].message)
    },
    update: (cache, response) => {
      console.log("updating:")
      console.log("----------------------------")
      const variables = { genre: selectedGenre }
      cache.updateQuery(
        { query: ALL_BOOKS, variables: variables },
        ({ allBook }) => {
          return { allBook: allBook.concat(response.data.addBook) }
        }
      )
    },
  })

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      notify(error.graphQLErrors[0].message)
    },
  })
  const response = useQuery(ALL_AUTHORS)

  if (!show) {
    return null
  }
  if (response.loading) {
    return <div>....loading</div>
  }

  const authors = response.data.allAuthor

  const submit = async (event) => {
    event.preventDefault()
    const intPublished = parseInt(published, 10)

    newBook({ variables: { title, author, published: intPublished, genres } })

    setTitle("")
    setPublished("")
    setAuthor("")
    setGenres([])
    setGenre("")
  }
  const submitEdit = async (event) => {
    event.preventDefault()
    const intBorn = parseInt(born, 10)

    editAuthor({ variables: { name: name.value, born: intBorn } })

    setName("")
    setBorn("")
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre("")
  }
  let option = []
  authors.forEach((a) => {
    option.push({ value: a.name, label: a.name })
  })

  return (
    <div>
      <h2>Add Book</h2>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
      <h2>Edit Author</h2>
      <form onSubmit={submitEdit}>
        <div>
          Name
          <Select
            placeholder={"choose an author "}
            value={name}
            onChange={(v) => {
              setName(v)
            }}
            options={option}
          ></Select>
        </div>

        <div>
          Born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>

        <button type="submit">Edit Author</button>
      </form>
    </div>
  )
}

export default NewBook
