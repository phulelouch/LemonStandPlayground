import Types from '../actions/types';

const INITIAL_STATE = {
  data: [],
};
const wishlist = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.SAVE_WISHLIST:
      delete action.type;
      return {
        ...state,
        data: action.data,
        action,
      };

    default:
      return state;
  }
};

export default wishlist;
