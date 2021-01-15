import compose from './compose';

export default function applyMiddleware(...middlewares) {
  return createStore => (reducer, preloadedState) => {
    const store = createStore(reducer, preloadedState);
    let { getState, dispatch } = store;
    let chain = [];

    const middlewareAPI = {
      getState,
      dispatch: (action, ...args) => dispatch(action, ...args) //[WHY] 保证只要 dispatch 更新了，middlewareAPI 中的 dispatch 应用也会发生变化
    };
    chain = middlewares.map(middleware => middleware(middlewareAPI));
    //改造 dispatch
    dispatch = compose(...chain)(dispatch);

    return {
      ...store,
      dispatch
    };
  };
}
