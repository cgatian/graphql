import { ApolloServer, gql, AuthenticationError } from "apollo-server";
    // tslint:disable:typedef
// this is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling"
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton"
  }
];

// type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: String
  }

  interface SlingDocument {
    id: String
    type: String
    title: String
  }

  type ObDocument implements SlingDocument {
    id: String
    title: String
    type: String
    createdDate: String
  }

  type SbDocument implements SlingDocument {
    id: String
    title: String
    type: String
  }

  extend type ObDocument {
    wenis: String
  }

  type Query {
    books: [Book]
    search: [SlingDocument]
  }
`;

// resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    search: () => {
      return [
        {
          id: "1",
          type: "ShareBase",
          title: "PO Invoice #223"
        },
        {
          id: "2",
          type: "OnBase",
          title: "Resume for Billy Smith"
        }
      ];
    }
  },
  SbDocument: {

  },
  ObDocument: {

    createdDate() {
      return "7/11/2015";
    },
    wenis() {
      return "TEST";
    }
  },
  SlingDocument: {
    // tslint:disable-next-line:typedef
    __resolveType(obj, context, info) {
      if (obj.type === "OnBase") {
        return "ObDocument";
      } else {
        return "SbDocument";
      }

      return null;
    }
  }
};

// in the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// this `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
