import { GraphQLServer } from 'graphql-yoga';

// Fake data
const users = [
  {
    id: 1,
    name: 'Nguyen Quang An',
    email: 'ngquangan@gmail.com',
    age: 22,
  },
  {
    id: 2,
    name: 'Nguyen Van An',
    email: 'ngvanan@gmail.com',
    age: 23,
  },
  {
    id: 3,
    name: 'Nguyen Huu C',
    email: 'nghuuc@gmail.com',
    age: 24,
  }
]

const posts = [
  {
    id: 10,
    title: 'GraphQL 101',
    body: 'This is first tutorials for graphQL',
    published: true,
    author: 1
  },
  {
    id: 11,
    title: 'GraphQL 102',
    body: 'This is first tutorials for graphQL',
    published: false,
    author: 2
  },
  {
    id: 12,
    title: 'GraphQL 103',
    body: 'This is first tutorials for graphQL',
    published: false,
    author: 1
  }
]

// Types

const typeDefs = `
  type Query {
    users: [User!]!
    me: User!
    posts(query: String): [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int!
    posts: [Post]!
  }

`

// Resolver

const resolvers = {
  Query: {
    me() {
      return {
        ...users[0]
      }
    },
    users() {
      return users;
    },
    posts() {
      return posts;
    }
  },
  Post: { // Custom rieng cho Post type moi khi duoc goi
    author(parent, args, ctx, info) {
      console.log(ctx);
      // parent la gia tri cua object post
      return users.find(user => user.id === parent.author);
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id)
    }
  }
}

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log('Server is started!'));