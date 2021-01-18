function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    //如果 action 是函数，调用这个函数
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }
    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
