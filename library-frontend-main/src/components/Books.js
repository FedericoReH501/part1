import { useQuery } from "@apollo/client"
import { ALL_BOOKS, ALL_GENRES } from "../queries"

const Books = ({ show, selectedGenre, setSelectedGenre }) => {
  const response = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
    pollInterval: undefined,
  })

  const genresResponse = useQuery(ALL_GENRES, { pollInterval: undefined })
  if (!show) {
    return null
  }
  if (response.loading || genresResponse.loading) {
    return <div>.....loading</div>
  }
  const genres = genresResponse.data.allGenres
  const books = response.data.allBook

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
      {genres.map((g) => (
        <button key={g} onClick={() => setSelectedGenre(g)}>
          {g}
        </button>
      ))}
      <button onClick={() => setSelectedGenre(null)}>Clean</button>
    </div>
  )
}

export default Books
