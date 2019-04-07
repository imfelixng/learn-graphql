const Subscription = {
  count: {
    subscribe(parent, args, ctx, info){
      return ctx.pubsub.asyncIterator('count');
    }
  }
}

export default Subscription;