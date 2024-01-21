import { gql } from "@apollo/client"

export const ALL_AUTHORS = gql`
  query {
    allAuthor {
      name
      born
      bookCount
    }
  }
`
export const ALL_BOOKS = gql`
  query allbook($genre: String) {
    allBook(genre: $genre) {
      title
      genres
      author {
        name
      }
      published
    }
  }
`
export const ADD_BOOK = gql`
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
export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, born: $born) {
      name
      born
    }
  }
`
