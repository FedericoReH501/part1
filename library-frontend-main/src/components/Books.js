import { gql, useQuery } from "@apollo/client"

const Books = (props) => {
  const ALL_BOOKS = gql`
    query {
      allBook {
        title
        author
        published
      }
    }
  `
  const response = useQuery(ALL_BOOKS, { pollInterval: 2000 })
  if (!props.show) {
    return null
  }
  if (response.loading) {
    return <div>.....loading</div>
  }
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
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
