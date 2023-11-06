/* eslint-disable no-param-reassign */
import Types from '../actions/types';

const INITIAL_STATE = {
  ids: [],
};

const productIAP = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.SAVE_PRODUCT_IAP:
      delete action.type;
      return {
        ...state,
        ids: action.ids,
      };
    default:
      return state;
  }
};

export default productIAP;
