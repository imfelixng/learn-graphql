
// UserRole



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

    const userExists = ctx.db.users.some(user => user.id === author);

    if (!userExists) throw new Error('User is not exists.')

    const newPost = {
      id: new Date().getTime(),
      title,
      body,
      published,
      author
    }
    ctx.db.posts.push(newPost);

    if (newPost.published) {
      ctx.pubsub.publish('post', { 
        post: {
          mutation: 'CREATED',
          data: newPost
        }
       });
    }

    return {
      ...newPost,
    }
  },
  createComment(parent, args, ctx, info) {
    const { text, author, post } = args.data;

    const userExists = ctx.db.users.some(user => user.id === author);
    const postExists = ctx.db.posts.some(postItem => {
      return (postItem.id === post) && postItem.published;
    });

    if (!userExists) throw new Error('User is not exist.');

    if (!postExists) throw new Error('Post is not exist.');

    const newComment = {
      id: new Date().getTime(),
      text,
      author,
      post
    }

    ctx.db.comments.push(newComment);

    ctx.pubsub.publish(`comment ${post}`, { 
      comment: {
        mutation: 'CREATED',
        data: newComment
      }
     })

    return newComment;

  },
  deleteUser(parent, args, ctx, info) {
    const { id } = args;

    const userIndex = ctx.db.users.findIndex(user => user.id === id);

    if (userIndex === -1) throw new Error('User is not exists');

    const userDeleted = ctx.db.users.splice(userIndex, 1);

    ctx.db.posts = ctx.db.posts.filter(post => {
      const match = post.author === id;
      if (match) {
        ctx.db.comments = ctx.db.comments.filter(comment => comment.post !== post.id);
      }
      return !match;
    });

    ctx.db.comments = ctx.db.comments.filter(comment => comment.author !== id);

    return userDeleted[0];

  },
  deletePost(parent, args, ctx, info) {
    const { id } = args;
    const postIndex = ctx.db.posts.findIndex(post => post.id === id);

    if (postIndex === -1 ) throw new Error('Post is not exists');

    const [post] = ctx.db.posts.splice(postIndex, 1);

    ctx.db.comments = ctx.db.comments.filter(comment => comment.post !== id);

    if (post.published) {
      ctx.pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      })
    }

    return post;

  },
  deleteComment(parent, args, ctx, info) {
    const { id } = args;
    const commentIndex = ctx.db.comments.findIndex(comment => comment.id === id);

    if (commentIndex === -1 ) throw new Error('Comment is not exists');

    const [comment] = ctx.db.comments.splice(commentIndex, 1);

    ctx.pubsub.publish(`comment ${post}`, { 
      comment: {
        mutation: 'DELETED',
        data: comment
      }
     })

    return comment;

  },
  updateUser(parent, args, ctx, info) {
    const { id, data } = args;
    const { name, email, age } = data;
    
    const user = ctx.db.users.find(user => user.id === id);

    if (!user) throw new Error('User is not exists');

    if (typeof email === 'string') {
      const emailTaken = ctx.db.users.find(user => user.email === email);
      if (emailTaken) throw new Error('Email taken');

      user.email = email;

    }

    if (typeof name === 'string') {
      user.name = name;
    }

    if (typeof name !== 'undefined') {
      user.age = age;
    }

    return user;

  },
  updatePost(parent, args, ctx, info) {
    const { id, data } = args;
    const { title, body, published } = data;

    const post = ctx.db.posts.find(post => post.id === id);

    const originalPost = { ...post }

    if (!post) throw new Error('Post is not exists');

    if (typeof title === 'string') {
      post.title = title;
    }

    if (typeof body === 'string') {
      post.body = body;
    }

    if (typeof published === 'boolean') {
      post.published = published;

      if(originalPost.published && !post.published) {
        // deleted = true => false
        ctx.pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        })
      } else if (!originalPost.published && post.published){
        // created = false => true
        ctx.pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        })
      }
    } else if (post.published) {
      //updated = true => true
      ctx.pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      })
    }

    return post;

  },
  updateComment(parent, args, ctx, info) {
    const { id, data } = args;
    const { text } = data;

    const comment = ctx.db.comments.find(comment => comment.id === id);

    if (!comment) throw new Error('comment is not exists');

    if (typeof text === 'string') {
      comment.text = text;
    }

    ctx.pubsub.publish(`comment ${post}`, { 
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
     })
    
    return comment;

  }
};

export default Mutation;