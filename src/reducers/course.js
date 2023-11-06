import Types from '../actions/types';

const INITIAL_STATE = {
  data: null,
};
const course = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.SAVE_COURSE:
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

export default course;
