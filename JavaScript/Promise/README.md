# 手写实现 Promise
[Promise/A+ 规范](https://promisesaplus.com/)完全实现

#### 代码

[完整代码](https://github.com/B1gF4ceC4t/study-notes/blob/main/JavaScript/Promise/promise.js)

```
//定义三个常量表示状态 pending fulfilled rejected
var PENDING = "pending";
var FULFILLED = "fulfilled";
var REJECTED = "rejected";

//实现 Promise
function MyPromise(fn) {
  this.status = PENDING;
  this.value = null;
  this.reason = null;

  //成功的回调函数队列
  this.onFulfilledCallbacks = [];
  //失败的回调函数队列
  this.onRejectedCallbacks = [];

  //存储 this 指向
  var self = this;

  function resolve(value) {
    if (self.status === PENDING) {
      self.status = FULFILLED;
      self.value = value;
      //执行成功回调
      self.onFulfilledCallbacks.forEach((callback) =>
        callback(self.value)
      );
    }
  }

  function reject(reason) {
    if (self.status === PENDING) {
      self.status = REJECTED;
      self.reason = reason;
      //执行失败回调
      self.onRejectedCallbacks.forEach((callback) =>
        callback(self.reason)
      );
    }
  }

  try {
    fn(resolve, reject);
  } catch (err) {
    reject(err);
  }
}

function resolvePromise(promise, res, resolve, reject) {
  //防止死循环
  if (res === promise)
    return reject(
      new TypeError("The promise and the return value are the same")
    );
  if (typeof res === "object" || typeof res === "function") {
    //null 直接 resolve
    if (res === null) return resolve(res);
    try {
      var then = res.then;
    } catch (err) {
      return reject(err);
    }
    if (typeof then === "function") {
      //记录 called 变量，保证只调用一次
      let called = false;
      try {
        //将 res 作为函数的作用域 this 调用 then
        then.call(
          res,
          function (res) {
            if (called) return;
            called = true;
            resolvePromise(promise, res, resolve, reject);
          },
          function (err) {
            if (called) return;
            called = true;
            reject(err);
          }
        );
      } catch (err) {
        if (called) return;
        reject(err);
      }
    } else {
      resolve(res);
    }
  } else {
    resolve(res);
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  var self = this;
  if (this.status === FULFILLED) {
    var promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        try {
          if (typeof onFulfilled === "function") {
            resolvePromise(
              promise2,
              onFulfilled(self.value),
              resolve,
              reject
            );
          } else {
            resolve(self.value);
          }
        } catch (err) {
          reject(err);
        }
      }, 0);
    });
    return promise2;
  } else if (this.status === REJECTED) {
    var promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        try {
          if (typeof onRejected === "function") {
            resolvePromise(
              promise2,
              onRejected(self.reason),
              resolve,
              reject
            );
          } else {
            reject(self.reason);
          }
        } catch (err) {
          reject(err);
        }
      }, 0);
    });
    return promise2;
  } else {
    //如果还是 pending 状态，将回调函数放入队列
    var promise2 = new MyPromise(function (resolve, reject) {
      self.onFulfilledCallbacks.push(function () {
        setTimeout(function () {
          try {
            if (typeof onFulfilled === "function") {
              resolvePromise(
                promise2,
                onFulfilled(self.value),
                resolve,
                reject
              );
            } else {
              resolve(self.value);
            }
          } catch (err) {
            reject(err);
          }
        }, 0);
      });
      self.onRejectedCallbacks.push(function () {
        setTimeout(function () {
          try {
            if (typeof onRejected === "function") {
              resolvePromise(
                promise2,
                onRejected(self.reason),
                resolve,
                reject
              );
            } else {
              reject(self.reason);
            }
          } catch (err) {
            reject(err);
          }
        }, 0);
      });
    });
    return promise2;
  }
};

MyPromise.prototype.catch = function (onRejected) {
  this.then(null, onRejected);
};

MyPromise.prototype.finally = function (fn) {
  return this.then(
    function (value) {
      return MyPromise.resolve(fn()).then(function () {
        return value;
      });
    },
    function (err) {
      return MyPromise.resolve(fn()).then(function () {
        throw err;
      });
    }
  );
};

//实现 Promise.resolve
MyPromise.resolve = function (parameter) {
  if (parameter instanceof MyPromise) {
    return parameter;
  }
  return new MyPromise(function (resolve) {
    resolve(parameter);
  });
};

//实现 Promise.reject
MyPromise.reject = function (parameter) {
  return new MyPromise(function (resolve, reject) {
    reject(parameter);
  });
};

//实现 Promise.all
MyPromise.all = function (iterators) {
  const promiseList = Array.from(iterators);
  return new MyPromise((resolve, reject) => {
    let count = 0;
    let len = promiseList.length;
    let result = [];
    if (len === 0) resolve(result);
    promiseList.forEach((promise, index) => {
      MyPromise.resolve(promise).then(
        (value) => {
          result[index] = value;
          count++;
          if (count === len) resolve(result);
        },
        (err) => {
          reject(err);
        }
      );
    });
  });
};

//实现 Promise.race
MyPromise.race = function (iterators) {
  const promiseList = Array.from(iterators);
  return new MyPromise((resolve, reject) => {
    if (promiseList.length === 0) return resolve();
    promiseList.forEach((promise) => {
      MyPromise.resolve(promise).then(resolve, reject);
    });
  });
};

//实现 Promise.allSettled [ES2020]
MyPromise.allSettled = function (iterable) {
  const promiseList = Array.from(iterable);
  return new MyPromise((resolve, reject) => {
    var count = 0;
    var len = promiseList.length;
    var result = [];
    if (len === 0) resolve(result);
    promiseList.forEach((promise, index) => {
      MyPromise.resolve(promise).then(
        (res) => {
          result[index] = { status: FULFILLED, value: res };
          if (++count === len) {
            resolve(result);
          }
        },
        (err) => {
          result[index] = { status: REJECTED, reason: err };
          if (++count === len) {
            resolve(result);
          }
        }
      );
    });
  });
};
```

#### 测试

[测试结果](https://github.com/B1gF4ceC4t/study-notes/blob/main/JavaScript/Promise/test.text)      **872 passing**