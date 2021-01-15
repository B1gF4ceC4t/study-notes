export default function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);
  //合法的 reducers
  const finalReducers = {};
  for (let key of reducerKeys) {
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducer[key];
    }
  }

  const finalReducerKeys = Object.keys(finalReducers);

  //返回新的组合后的 reducer 函数
  return function combination(state, action) {
    let hasChanged = false;
    const nextState = {};
    for (let key of finalReducerKeys) {
      const reducer = finalReducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    hasChanged =
      hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
}
