import ActionTypes from './actionTypes';

export default function createStore(reducer, preloadedState, enhancer) {
  //enhancer 可作为第二个或第三个参数
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      //enhancer 必须是函数
      throw new Error('Expected the enhancer to be a function.');
    }
    //层层执行 最后一层执行返回一个正常的 store 和一个被变更过的 dispatch 方法
    return enhancer(createStore)(reducer, preloadedState);
  }

  let currentState = preloadedState;
  let currentReducer = reducer;
  let subQueue = []; //订阅事件队列
  let isDispatching = false; //正在 dispatch

  //返回当前的 state
  function getState() {
    if (isDispatching) throw new Error('is dispatching');

    return currentState;
  }

  //更改 state
  function dispatch(action) {
    if (isDispatching) throw new Error('is dispatching');

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    //执行订阅事件
    for (let callback of subQueue) {
      callback();
    }

    return action;
  }

  //订阅事件
  function subscribe(listener) {
    if (isDispatching) throw new Error('is dispatching');

    //将回调函数放入订阅事件队列里
    subQueue.push(listener);

    //返回取消订阅事件函数
    return function unsubscribe() {
      if (isDispatching) throw new Error('is dispatching');

      //找到当前订阅事件索引
      const index = nextListeners.indexOf(listener);
      //移除订阅事件
      if (index !== -1) return subQueue.splice(index, 1);
      return [];
    };
  }

  //替换当前的 reducer
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;

    dispatch({ type: ActionTypes.REPLACE });
  }

  dispatch({ type: ActionTypes.INIT });

  return {
    getState,
    dispatch,
    subscribe,
    replaceReducer
  };
}
