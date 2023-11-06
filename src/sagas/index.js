import { all, takeLatest } from 'redux-saga/effects';
import Types from '../actions/types';
import { debug } from './debug-saga';
import { showLoading } from './common';

// const debounced = _.debounce(fakeFunction, 3000);

// function fakeFunction() {}

export default function* rootSaga() {
  yield all([
    takeLatest(Types.TEST, debug),
    takeLatest(Types.SHOW_LOADING, showLoading),
  ]);
}
