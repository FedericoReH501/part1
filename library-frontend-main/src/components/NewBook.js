import { useState } from "react"
import { gql, useMutation, useQuery } from "@apollo/client"
import Select from "react-select"
const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String]
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author {
        name
      }
      id
      published
      genres
    }
  }
`
const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, born: $born) {
      name
      born
    }
  }
`
const ALL_AUTHORS = gql`
  query {
    allAuthor {
      name
      born
    }
  }
`

const NewBook = (props) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [published, setPublished] = useState("")
  const [genre, setGenre] = useState("")
  const [genres, setGenres] = useState([])
  const [name, setName] = useState("")
  const [born, setBorn] = useState("")
  const [newBook] = useMutation(ADD_BOOK)
  const [editAuthor] = useMutation(EDIT_AUTHOR)
  const response = useQuery(ALL_AUTHORS, { pollInterval: 2000 })

  if (!props.show) {
    return null
  }
  if (response.loading) {
    return <div>....loading</div>
  }

  const authors = response.data.allAuthor

  const submit = async (event) => {
    event.preventDefault()
    const intPublished = parseInt(published, 10)
    console.log(intPublished)
    console.log(published)
    newBook({ variables: { title, author, published: intPublished, genres } })
    console.log("add book...")

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
    console.log("edit Author...")

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
  console.log("name: ")
  console.log(name)

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
              console.log(v.value)
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
