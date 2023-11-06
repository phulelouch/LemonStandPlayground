/**
 * @flow
 */

import { put, delay } from 'redux-saga/effects';
import { saveDebug } from '../actions/debug';
/* eslint-disable import/prefer-default-export */
export function* debug() {
  yield delay(300);
  // const { debug } = yield select();
  yield put(saveDebug(true));
}
