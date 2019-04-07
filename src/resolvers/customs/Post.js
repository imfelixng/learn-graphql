const Post = { // Custom rieng cho Post type moi khi duoc goi
  author(parent, args, ctx, info) {
    // parent la gia tri cua object post
    return ctx.db.users.find(user => user.id === parent.author);
  },
  comments(parent, args, ctx, info) {
    return ctx.db.comments.filter(comment => comment.post === parent.id)
  },
};

export default Post;