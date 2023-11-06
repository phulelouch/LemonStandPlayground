/* eslint-disable no-param-reassign */
import Types from '../actions/types';

const INITIAL_STATE = {
  isAppOpen: true,
  loading: false,
};

const common = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.SET_APP_OPEN:
      delete action.type;
      return {
        ...state,
        isAppOpen: action.isAppOpen,
      };
    case Types.SET_LOADING:
      delete action.type;
      return {
        ...state,
        loading: action.loading,
      };
    default:
      return state;
  }
};

export default common;
