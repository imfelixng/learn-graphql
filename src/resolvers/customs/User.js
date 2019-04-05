const User = {
  posts(parent, args, ctx, info) {
    return ctx.db.posts.filter(post => post.author === parent.id)
  },
  comments(parent, args, ctx, info) {
    return ctx.db.comments.filter(comment => comment.author === parent.id)
  },
  
};

export default User;