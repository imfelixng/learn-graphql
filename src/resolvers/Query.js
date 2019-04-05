const Query = {
  users(parent, args, ctx, info) {
    return ctx.db.users;
  },
  posts(parent, args, ctx, info) {
    return ctx.db.posts;
  },
  comments(parent, args, ctx, info) {
    return ctx.db.comments;
  }
};

export default Query;