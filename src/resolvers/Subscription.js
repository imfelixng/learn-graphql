const Subscription = {
  count: {
    subscribe(parent, args, ctx, info){
      return ctx.pubsub.asyncIterator('count');
    }
  },
  comment: {
    subscribe(parent, args, ctx, info) {

      const { postID } = args;
      const { db, pubsub } = ctx;
      const post = db.posts.find(post => (post.id === postID) && post.published === true);
      if (!post) throw new Error('Post not found');
      return ctx.pubsub.asyncIterator(`comment ${postID}`);
    }
  }
}

export default Subscription;