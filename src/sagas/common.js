/**
 * @flow
 */

import { put } from 'redux-saga/effects';
import { ProgressBar } from 'app-component';
import { setLoading } from '../actions/common';

// eslint-disable-next-line import/prefer-default-export
export function* showLoading(actions) {
  const { loading, isNative } = actions.data;
  if (isNative) {
    // eslint-disable-next-line no-unused-expressions
    loading
      ? ProgressBar.Circle.showSpinIndeterminate()
      : ProgressBar.Circle.dismiss();
    return;
  }

  yield put(setLoading(loading));
}
