# Redux 源码分析
[Redux 官网](https://redux.js.org/)
[Redux 源码](https://github.com/reduxjs/redux)

#### 认识 Redux

##### Redux是什么？

Redux是 **JavaScript 状态容器**，能提供**可预测化的状态管理**。

它认为：

* Web 应用是一个状态机，视图与状态是一一对应的。

* 所有的状态，保存在一个对象里面。

#### Redux 设计原则

* 单一数据源
* State 是只读的
* 使用纯函数执行修改

##### Redux 的核心概念

* **Store**：保存数据的地方，你可以把它看成一个容器，整个应用只能有一个Store。

* **State**：Store对象包含所有数据，如果想得到某个时点的数据，就要对Store生成快照，这种时点的数据集合，就叫做State。

* **Action**：State的变化，会导致View的变化。但是，用户接触不到State，只能接触到View。所以，State的变化必须是View导致的。Action就是View发出的通知，表示State应该要发生变化了。

* **Action Creator**：View要发送多少种消息，就会有多少种Action。如果都手写，会很麻烦，所以我们定义一个函数来生成Action，这个函数就叫Action Creator。

* **Reducer**：Store收到Action以后，必须给出一个新的State，这样View才会发生变化。这种State的计算过程就叫做Reducer。Reducer是一个函数，它接受Action和当前State作为参数，返回一个新的State。

* **dispatch**：是View发出Action的唯一方法。

#### Redux 工作流程

1. 首先，用户（通过 View）发出 Action，发出方式就用到了 dispatch 方法。
2. 然后，Store 自动调用 Reducer，并且传入两个参数：当前 State 和收到的 Action，Reducer 会返回新的 State。
3. State 一旦有变化，Store 就会调用监听函数，来更新 View。

##### 为什么要用 Redux ？

让每个 State 变化都是**可预测的**，将应用中的所有动作与状态都**统一管理**，让一切有据可循。

#### 主流程代码

- **[createStore](https://github.com/B1gF4ceC4t/study-notes/blob/main/Redux/Redux/createStore.js)**：生成 store
    - `store.getState`：返回当前状态
    - `store.subscribe`：注册监听事件
        - 函数放入监听队列
        - 返回取消订阅函数
    - `store.dispatch`：分发 action，修改 state 的唯一方式
        - 调用 reducer
        - 按顺序执行 listener
        - 返回 action
    - `store.replaceReducer`：替换当前 reducer 并重新初始化 state 树
- **[bindActionCreators](https://github.com/B1gF4ceC4t/study-notes/blob/main/Redux/Redux/bindActionCreators.js)**：把 action creators 转成拥有同名 keys 的对象，使用 dispatch 把每个 action creator 包装起来，这样可以直接调用它们
> 当你需要把 action creator 往下传到一个组件上，却不想让这个组件察觉到 Redux 的存在，而且不希望把 store 或 dispatch 传给它。

- **[combineReducers](https://github.com/B1gF4ceC4t/study-notes/blob/main/Redux/Redux/combineReducers.js)**：合并 reducer

> 因为当我们应用比较大的时候 reducer 会按照模块拆分看上去会比较清晰，但是传入 store 的 reducer 必须是一个函数，所以用这个方法来做合并。

- **[compose](https://github.com/B1gF4ceC4t/study-notes/blob/main/Redux/Redux/compose.js)**：组合传入的一系列函数，在中间件时会用到，执行的最终结果是把各个函数串联起来

- **[applyMiddleware](https://github.com/B1gF4ceC4t/study-notes/blob/main/Redux/Redux/applyMiddleware.js)**：用于 store 的增强

> 因为中间件是要多个首尾相连的，需要一层层的”加工“，所以要有个 next 方法来独立一层确保串联执行，另外 dispatch 增强后也是个 dispatch 方法，也要接收 action 参数，所以最后一层肯定是 action。
> ```
>   /*中间件代码结构*/
>   function middleware() {
>     return ({getState, dispatch}) => 
>       next => 
>         action => next(action)
>   }
> ```

#### 参考资料

* [Redux从设计到源码](https://tech.meituan.com/2017/07/14/redux-design-code.html)