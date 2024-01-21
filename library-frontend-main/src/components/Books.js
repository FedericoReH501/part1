import { useQuery } from "@apollo/client"
import { ALL_BOOKS, ALL_GENRES } from "../queries"
import { useState } from "react"
const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null)
  const response = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
    pollInterval: undefined,
  })
  const genresResponse = useQuery(ALL_GENRES, { pollInterval: undefined })
  if (!props.show) {
    return null
  }
  if (response.loading || genresResponse.loading) {
    return <div>.....loading</div>
  }
  const genres = response.data.allBook

  const books = response.data.allBook
  console.log(genres)
  let allGenres = []
  genres.forEach((book) => {
    book.genres.forEach((g) => {
      if (!allGenres.includes(g)) {
        allGenres = allGenres.concat(g)
      }
    })
  })

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {allGenres.map((g) => (
        <button key={g} onClick={() => setSelectedGenre(g)}>
          {g}
        </button>
      ))}
      <button onClick={() => setSelectedGenre(null)}>Clean</button>
    </div>
  )
}

export default Books
