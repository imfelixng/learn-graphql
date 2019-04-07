import Query from './Query';
import Mutation from './Mutation';
import Subscription from './Subscription';
import Customs from './customs';

export default {
  Query,
  Mutation,
  ...Customs,
  Subscription
}