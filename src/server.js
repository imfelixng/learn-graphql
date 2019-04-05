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

const comments = [
  {
    id: 20,
    text: "Best course",
    author: 1,
    post: 10,
  },
  {
    id: 21,
    text: "Best course1",
    author: 2,
    post: 11,
  },
  {
    id: 22,
    text: "Best course2",
    author:1,
    post: 12,
  },
  {
    id: 23,
    text: "Best course3",
    author: 3,
    post: 10,
  }
]
// Types

const typeDefs = `
  type Query {
    users: [User!]!
    me: User!
    posts(query: String): [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int!
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    },
    comments() {
      return comments;
    }
  },
  Post: { // Custom rieng cho Post type moi khi duoc goi
    author(parent, args, ctx, info) {
      // parent la gia tri cua object post
      return users.find(user => user.id === parent.author);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id)
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id)
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.author === parent.id)
    },
    
  },
  Comment: {
    author(parent, args, ctx, info) {
      // parent la gia tri cua object post
      return users.find(user => user.id === parent.author);
    },
    post(parent, args, ctx, info) {
      return posts.find(post => post.id === parent.post)
    }
  }
}

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log('Server is started!'));