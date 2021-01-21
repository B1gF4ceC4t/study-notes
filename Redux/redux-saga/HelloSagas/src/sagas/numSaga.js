import { takeEvery, put, call } from 'redux-saga/effects';
import { delay } from '../utils';

export function* incrementAsync() {
  yield call(delay, 1000);
  yield put({ type: 'INCREMENT' });
}

export function* decreaseAsync() {
  yield call(delay, 1000);
  yield put({ type: 'DECREMENT' });
}

export function* watchIncrementAsync() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync);
}

export function* watchDecrementAsync() {
  yield takeEvery('DECREMENT_ASYNC', decreaseAsync);
}
