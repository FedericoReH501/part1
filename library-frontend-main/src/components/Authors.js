import { useQuery } from "@apollo/client"
import { ALL_AUTHORS } from "../queries"
const Authors = ({ show, notify }) => {
  const response = useQuery(ALL_AUTHORS, {
    onError: (e) => {
      notify(e.message)
    },
  })

  if (!show) {
    return null
  }
  if (response.loading) {
    return <div>....loading</div>
  }
  if (!response.data) {
    return null
  }
  const authors = response.data.allAuthor
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Authors
