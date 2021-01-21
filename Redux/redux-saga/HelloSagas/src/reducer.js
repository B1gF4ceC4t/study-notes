const initialState = {
  num: 0
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        num: state.num + 1
      };
    case 'DECREMENT':
      return {
        ...state,
        num: state.num - 1
      };
    default:
      return state;
  }
}
