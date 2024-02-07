import { useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import Select from "react-select"
import {
  ALL_AUTHORS,
  ALL_BOOKS,
  ADD_BOOK,
  EDIT_AUTHOR,
  ALL_GENRES,
} from "../queries"

const NewBook = ({ notify, show, selectedGenre }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [published, setPublished] = useState("")
  const [genre, setGenre] = useState("")
  const [genres, setGenres] = useState([])
  const [name, setName] = useState("")
  const [born, setBorn] = useState("")

  const [newBook] = useMutation(ADD_BOOK, {
    onError: (error) => {
      console.log("Error:", error)
      notify(error.graphQLErrors[0].message)
    },
    update: (cache, res) => {
      // Your update logic here...
      console.log("updating...")
      // For example, updating the cache for the ALL_BOOKS query
      cache.updateQuery(
        { query: ALL_BOOKS, variables: { genre: null } },
        ({ allBook }) => {
          console.log("allbook :")
          console.log(allBook)
          const updatedData = allBook.concat(res.data.addBook)
          return { allBook: updatedData }
        }
      )
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthor }) => {
        // Assuming the author data is available in the book result
        const author = res.data.addBook.author
        console.log("update......")

        // Check if the author already exists in the list
        const existingAuthor = allAuthor.find((a) => a.name === author.name)
        // If not, add the new author to the list
        if (!existingAuthor) {
          const updatedAuthors = [...allAuthor, { ...author, bookCount: 1 }]
          return { allAuthor: updatedAuthors }
        }

        // If the author already exists, update bookcount
        const updateList = allAuthor.map((a) => {
          if (a.name === author.name) {
            return { ...author, bookCount: a.bookCount + 1 }
          }
          return a
        })
        console.log("updated list", updateList)
        return { allAuthor: updateList }
      })
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
