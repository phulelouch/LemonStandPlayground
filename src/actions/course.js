/* eslint-disable import/prefer-default-export */
import Types from './types';

export const saveCourse = (data: Object) => ({
  type: Types.SAVE_COURSE,
  data,
});
