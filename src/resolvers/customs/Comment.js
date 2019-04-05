const Comment = {
  author(parent, args, ctx, info) {
    // parent la gia tri cua object post
    return ctx.db.users.find(user => user.id === parent.author);
  },
  post(parent, args, ctx, info) {
    return ctx.db.posts.find(post => post.id === parent.post)
  }
};

export default Comment;