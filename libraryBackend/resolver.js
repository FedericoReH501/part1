const { GraphQLError } = require("graphql")
const jwt = require("jsonwebtoken")

const mongoose = require("mongoose")
mongoose.set("strictQuery", false)
const { PubSub } = require("graphql-subscriptions")
const pubsub = new PubSub()
const Author = require("./models/autor")
const Book = require("./models/book")
const User = require("./models/user")

require("dotenv").config()

const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser
    },
    recomended: async (root, args, { currentUser }) => {
      const favoriteGenre = currentUser.favoriteGenre

      return Book.find({ genres: favoriteGenre }).populate("author")
    },
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allAuthor: async (root, args, context) => {
      console.log("fetching authors")
      return Author.find({})
    },
    allGenres: async () => {
      let allGenres = []
      const books = await Book.find({})
      books.forEach((book) => {
        book.genres.forEach((g) => {
          if (!allGenres.includes(g)) {
            allGenres = allGenres.concat(g)
          }
        })
      })
      return allGenres
    },
    allBook: async (root, args) => {
      console.log("fetching ALL_BOOK")
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
      const newBook = new Book({ ...args, author: author })
      try {
        await newBook.save()
      } catch (error) {
        throw new GraphQLError("Saving newBook failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        })
      }
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
      const user = await User.findOne({ username: args.username })
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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
}

module.exports = resolvers
