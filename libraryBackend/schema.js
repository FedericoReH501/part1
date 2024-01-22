const typeDefs = `
    type Author{
        name: String
        id: String!
        born: Int
        bookCount:String
    }
  type User {
      username: String!
      favoriteGenre: String!
      id: ID!
    }
  type Token {
      value: String!
    }
  type Book{
    title:String
    id:String!
    author:Author!
    published:Int
    genres:[String]
  }
  type Query {
    authorCount: Int
    bookCount: Int
    allBook(author:String,genre:String): [Book!]
    recomended(genre:String):[Book]
    allGenres: [String]
    allAuthor: [Author]
    me: User
  }

  type Mutation{
    addBook(
      title:String!
      author:String!
      published:Int!
      genres:[String]): Book

      editAuthor(
        name:String
        born:Int
        ): Author
      addUser(
          username: String!
          favoriteGenre: String!
        ): User
        login(
          username: String!
          password: String!
        ): Token
  }
 
`
module.exports = typeDefs
