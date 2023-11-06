/* eslint-disable no-param-reassign */
import Types from '../actions/types';

const INITIAL_STATE = {
  connection: true,
};

const network = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.NETWORK_STATUS:
      delete action.type;
      return {
        ...state,
        connection: action.connection,
      };
    default:
      return state;
  }
};

export default network;
