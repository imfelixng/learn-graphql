const Mutation = {
  createUser(parent, args, ctx, info) {
    const { email, name, age } = args.data;

    const emailTaken = ctx.db.users.some(user => user.email === email);

    if (emailTaken) throw new Error('Email taken.')

    const newUser = {
      id: new Date().getTime(),
      email,
      name,
      age,
    }
    ctx.db.users.push(newUser);
    return {
      ...newUser,
    }
  },
  createPost(parent, args, ctx, info) {
    const { title, body, published, author } = args.data;

    const userExists = ctx.db.users.some(user => user.id === parseInt(author));

    if (!userExists) throw new Error('User is not exists.')

    const newPost = {
      id: new Date().getTime(),
      title,
      body,
      published,
      author
    }
    ctx.db.posts.push(newPost);
    return {
      ...newPost,
    }
  },
  createComment(parent, args, ctx, info) {
    const { text, author, post } = args.data;

    const userExists = ctx.db.users.some(user => user.id === parseInt(author));
    const postExists = ctx.db.posts.some(postItem => postItem.id === parseInt(author) && postItem.published);

    if (!userExists) throw new Error('User is not exist.');

    if (!postExists) throw new Error('Post is not exist.');

    const newComment = {
      id: new Date().getTime(),
      text,
      author,
      post
    }

    ctx.db.comments.push(newComment);

    return newComment;

  },
  deleteUser(parent, args, ctx, info) {
    const { id } = args;

    const userIndex = ctx.db.users.findIndex(user => user.id === parseInt(id));

    if (userIndex === -1) throw new Error('User is not exists');

    const userDeleted = ctx.db.users.splice(userIndex, 1);

    ctx.db.posts = ctx.db.posts.filter(post => {
      const match = post.author === parseInt(id);
      if (match) {
        ctx.db.comments = ctx.db.comments.filter(comment => comment.post !== post.id);
      }
      return !match;
    });

    ctx.db.comments = ctx.db.comments.filter(comment => comment.author !== parseInt(id));

    return userDeleted[0];

  },
  deletePost(parent, args, ctx, info) {
    const { id } = args;
    const postIndex = ctx.db.posts.findIndex(post => post.id === parseInt(id));

    if (postIndex === -1 ) throw new Error('Post is not exists');

    const postDeleted = ctx.db.posts.splice(postIndex, 1);

    ctx.db.comments = ctx.db.comments.filter(comment => comment.post !== parseInt(id));

    return postDeleted[0];

  },
  deleteComment(parent, args, ctx, info) {
    const { id } = args;
    const commentIndex = ctx.db.comments.findIndex(comment => comment.id === parseInt(id));

    if (commentIndex === -1 ) throw new Error('Comment is not exists');

    const commentDeleted = ctx.db.comments.splice(commentIndex, 1);

    return commentDeleted[0];

  }
};

export default Mutation;