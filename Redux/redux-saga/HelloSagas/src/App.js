import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { increaseAsync, decreaseAsync } from './actions/numActions';

const App = ({ num, actions }) => {
  return (
    <Fragment>
      {num}
      <button onClick={actions.increase}>+</button>
      <button onClick={actions.decrease}>-</button>
    </Fragment>
  );
};
const mapStateToProps = ({ num }) => ({
  num
});
const mapDispatchToProps = dispatch => ({
  actions: {
    increase: () => dispatch(increaseAsync),
    decrease: () => dispatch(decreaseAsync)
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
