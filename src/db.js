const users = [
  {
    id: '1',
    name: 'Nguyen Quang An',
    email: 'ngquangan@gmail.com',
    age: 22,
  },
  {
    id: '2',
    name: 'Nguyen Van An',
    email: 'ngvanan@gmail.com',
    age: 23,
  },
  {
    id: '3',
    name: 'Nguyen Huu C',
    email: 'nghuuc@gmail.com',
    age: 24,
  }
]

const posts = [
  {
    id: '10',
    title: 'GraphQL 101',
    body: 'This is first tutorials for graphQL',
    published: true,
    author: '1'
  },
  {
    id: '11',
    title: 'GraphQL 102',
    body: 'This is first tutorials for graphQL',
    published: true,
    author: '2'
  },
  {
    id: '12',
    title: 'GraphQL 103',
    body: 'This is first tutorials for graphQL',
    published: true,
    author: '1'
  }
]

const comments = [
  {
    id: '20',
    text: "Best course",
    author: '1',
    post: '10',
  },
  {
    id: '21',
    text: "Best course1",
    author: '2',
    post: '11',
  },
  {
    id: '22',
    text: "Best course2",
    author:'1',
    post: '12',
  },
  {
    id: '23',
    text: "Best course3",
    author: '3',
    post: '10',
  }
]

const db = {
  users,
  posts,
  comments
};

export default db;