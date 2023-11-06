import Types from './types';

// eslint-disable-next-line import/prefer-default-export
export const saveProductIAP = (ids) => ({
  type: Types.SAVE_PRODUCT_IAP,
  ids,
});
