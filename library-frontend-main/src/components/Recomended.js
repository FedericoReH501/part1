import { useQuery } from "@apollo/client"
import { ALL_BOOKS, RECOMENDED } from "../queries"

const Recomended = (props) => {
  const result = useQuery(RECOMENDED, { pollInterval: undefined })

  if (!props.show) {
    return null
  }
  if (result.loading) {
    return <div>.....loading</div>
  }
  const books = result.data.recomended
  console.log("suggested book:", result.data)
  if (!books) {
    return <div>No favorites added</div>
  }
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
    </div>
  )
}
export default Recomended
