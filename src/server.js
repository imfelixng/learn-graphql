import { GraphQLServer } from 'graphql-yoga';

// Fake data
let users = [
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

let posts = [
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

let comments = [
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

  type Mutation {
    createUser(data: CreateUserInput): User!
    createPost(data: CreatePostInput): Post!
    createComment(data: CreateCommentInput): Comment!
    deleteUser(id: ID!): User!
    deletePost(id: ID!): Post!
    deleteComment(id: ID!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
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
    age: Int
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
  Mutation: {
    createUser(parent, args, ctx, info) {
      const { email, name, age } = args.data;

      const emailTaken = users.some(user => user.email === email);

      if (emailTaken) throw new Error('Email taken.')

      const newUser = {
        id: new Date().getTime(),
        email,
        name,
        age,
      }
      users.push(newUser);
      return {
        ...newUser,
      }
    },
    createPost(parent, args, ctx, info) {
      const { title, body, published, author } = args.data;

      const userExists = users.some(user => user.id === parseInt(author));

      if (!userExists) throw new Error('User is not exists.')

      const newPost = {
        id: new Date().getTime(),
        title,
        body,
        published,
        author
      }
      posts.push(newPost);
      return {
        ...newPost,
      }
    },
    createComment(parent, args, ctx, info) {
      const { text, author, post } = args.data;

      const userExists = users.some(user => user.id === parseInt(author));
      const postExists = posts.some(postItem => postItem.id === parseInt(author) && postItem.published);

      if (!userExists) throw new Error('User is not exist.');

      if (!postExists) throw new Error('Post is not exist.');

      const newComment = {
        id: new Date().getTime(),
        text,
        author,
        post
      }

      comments.push(newComment);

      return newComment;

    },
    deleteUser(parent, args, ctx, info) {
      const { id } = args;

      const userIndex = users.findIndex(user => user.id === parseInt(id));

      if (userIndex === -1) throw new Error('User is not exists');

      const userDeleted = users.splice(userIndex, 1);

      posts = posts.filter(post => {
        const match = post.author === parseInt(id);
        if (match) {
          comments = comments.filter(comment => comment.post !== post.id);
        }
        return !match;
      });

      comments = comments.filter(comment => comment.author !== parseInt(id));

      return userDeleted[0];

    },
    deletePost(parent, args, ctx, info) {
      const { id } = args;
      const postIndex = posts.findIndex(post => post.id === parseInt(id));

      if (postIndex === -1 ) throw new Error('Post is not exists');

      const postDeleted = posts.splice(postIndex, 1);

      comments = comments.filter(comment => comment.post !== parseInt(id));

      return postDeleted[0];

    },
    deleteComment(parent, args, ctx, info) {
      const { id } = args;
      const commentIndex = comments.findIndex(comment => comment.id === parseInt(id));

      if (commentIndex === -1 ) throw new Error('Comment is not exists');

      const commentDeleted = comments.splice(commentIndex, 1);

      return commentDeleted[0];

    }
  },
  Post: { // Custom rieng cho Post type moi khi duoc goi
    author(parent, args, ctx, info) {
      // parent la gia tri cua object post
      return users.find(user => user.id === parseInt(parent.author));
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