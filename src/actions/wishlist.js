/* eslint-disable import/prefer-default-export */
import Types from './types';

export const saveDataWishlist = (data) => ({
  type: Types.SAVE_WISHLIST,
  data,
});
