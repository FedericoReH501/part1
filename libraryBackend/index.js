const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const { GraphQLError } = require("graphql")
const jwt = require("jsonwebtoken")

const mongoose = require("mongoose")
mongoose.set("strictQuery", false)

const Author = require("./models/autor")
const Book = require("./models/book")
const User = require("./models/user")

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

const resolvers = {
  Query: {
    me: (root, args, context) => context.currentUser,
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allAuthor: async (root, args, context) => {
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
    },
  },
  Author: {
    bookCount: async (root, args) => {
      const writtenBook = await Book.find({ author: root._id })
      return writtenBook.length
    },
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        const newAuthor = new Author({ name: args.author })
        try {
          author = await newAuthor.save()
        } catch (error) {
          throw new GraphQLError("Saving new author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.name,
              error,
            },
          })
        }
      }
      const newBook = new Book({ ...args, author: author._id })
      try {
        await newBook.save()
      } catch (error) {
        console.log(error)
        throw new GraphQLError("Saving newBook failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        })
      }
      console.log("added a new book:  ", newBook)
      console.log("------------------------------------")
      return newBook
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      const intBorn = parseInt(args.born, 10)
      author.born = intBorn

      return author.save()
    },
    addUser: async (root, args) => {
      const newUser = new User({ ...args, password: "password" })
      try {
        await newUser.save()
      } catch (error) {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        })
      }
      return newUser
    },
    login: async (root, args) => {
      const user = await User.findOne({ userName: args.userName })
      if (!user || args.password !== "password") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }
      const userForToken = { username: user.username, id: user._id }
      return { value: jwt.sign(userForToken, process.env.SECRET) }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(auth.substring(8), process.env.SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
