import { debug } from './debug';
import user from './user';
import common from './common';
import network from './network';
import course from './course';
import wishlist from './wishlist';
import productIAP from './product-iap';

const rootReducer = {
  user,
  debug,
  common,
  network,
  course,
  wishlist,
  productIAP,
};

export default rootReducer;
