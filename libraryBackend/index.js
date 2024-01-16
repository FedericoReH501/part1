const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const { v1: uuid } = require("uuid")
const mongoose = require("mongoose")
mongoose.set("strictQuery", false)

const Author = require("./models/autor")
const Book = require("./models/book")

require("dotenv").config()
const MONGODB_URI = process.env.MONGODB_URI

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message)
  })

const typeDefs = `
    type Author{
        name: String
        id: String!
        born: Int
        bookCount:String
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
    allAuthor: [Author]
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
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allAuthor: async (root, args) => {
      return Author.find({})
    },
    allBook: async (root, args) => {
      if (!args.author && !args.genre) {
        return Book.find({}).populate("author")
      }
      if (!args.author) {
        return Book.find({ genres: `${args.genre}` }).populate("author")
      }
      const authorFilter = await Author.findOne({ name: args.author })

      if (args.author && args.genre) {
        return Book.find({
          genres: `${args.genre}`,
          author: authorFilter._id,
        }).populate("author")
      }

      if (!args.genre) {
        return Book.find({ author: authorFilter._id }).populate("author")
      }

      /*return books.filter((b) => {
        return (
          (!args.author ? true : b.author === args.author) &&
          (!args.genre ? true : b.genres.includes(args.genre))
        )
      })*/
    },
  },
  Author: {
    bookCount: (root, args) =>
      books.filter((b) => b.author === root.name).length,
  },
  Mutation: {
    addBook: async (root, args) => {
      const author = await Author.findOne({ name: args.author })
      if (!author) {
        const newAuthor = new Author({ name: args.author })
        await newAuthor.save()
      }
      const newBook = new Book({ ...args, author: author._id })
      return newBook.save()
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      const intBorn = parseInt(args.born, 10)
      author.born = intBorn

      return author.save()
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
