function bindActionCreator(actionCreator, dispatch) {
  //对 actionCreator 绑定 dispatch 方法
  return (...args) => dispacth(actionCreator(...args));
}

export default function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function');
  }

  const keys = Object.keys(actionCreators);
  const boundActionCreators = {};
  for (let key of keys) {
    if (typeof actionCreators[key] === 'function') {
      boundActionCreators[key] = bindActionCreator(
        actionCreators[key],
        dispacth
      );
    }
  }
  return boundActionCreators;
}
