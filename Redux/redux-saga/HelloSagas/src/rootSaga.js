import { all } from 'redux-saga/effects';
import { watchIncrementAsync, watchDecrementAsync } from './sagas/numSaga';

export default function* rootSaga() {
  yield all([watchIncrementAsync(), watchDecrementAsync()]);
}
