(
    function () {
        // promise 就是构造函数
        // new Promise((resolve,reject)=>{.....})
        const PENDING = 'pending';
        const REJECTED = 'rejected';
        const RESOLVED = 'resolved';
        function Promise(excutor) {
            this.status = PENDING;
            this.data = undefined;
            this.callbacks = []; // {onResolved,onRejected}
            const resolve = (value) => {
                if (this.status !== PENDING) {
                    return;
                }
                this.status = RESOLVED;
                this.data = value;
                if (this.callbacks.length > 0) {
                    setTimeout(() => {
                        this.callbacks.forEach(callbacksObj => {
                            callbacksObj.onResolved(value);
                        });
                    });
                }
            }

            const reject = (reason) => {
                if (this.status !== PENDING) {
                    return;
                }
                this.status = REJECTED;
                this.data = reason;
                if (this.callbacks.length > 0) {
                    setTimeout(() => {
                        this.callbacks.forEach(callbacksObj => {
                            callbacksObj.onRejected(reason);
                        });
                    });
                }
            }

            try {
                excutor(resolve, reject);
            } catch (error) {
                reject(error);
            }
        }

        Promise.prototype.then = function (onResolved, onRejected) { // 传入两个会回调
            onResolved = typeof onResolved === 'function' ? onResolved : value => value;
            onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };
            return new Promise((resolve, reject) => {
                if (this.status === PENDING) {
                    this.callbacks.push({
                        onResolved(value) {
                            try {
                                const result = onResolved(value);
                                if (result instanceof Promise) {
                                    result.then(
                                        value => resolve(value),
                                        reason => reject(reason)
                                    )
                                } else {
                                    resolve(result);
                                }
                            } catch (error) {
                                reject(error)
                            }
                        },
                        onRejected(reason) {
                            try {
                                const result = onRejected(reason);
                                if (result instanceof Promise) {
                                    result.then(
                                        value => resolve(value),
                                        reason => reject(reason)
                                    )
                                } else {
                                    resolve(result);
                                }
                            } catch (error) {
                                reject(error)
                            }
                        }
                    })
                } else if (this.status === RESOLVED) { // 就相当于resolve的作用 因为resolve的时候没有callback函数 所以到这里要直接执行
                    setTimeout(() => {
                        try {
                            const result = onResolved(this.data);
                            if (result instanceof Promise) {
                                result.then(
                                    value => resolve(value),
                                    reason => reject(reason)
                                )
                            } else {
                                resolve(result);
                            }
                        } catch (error) {
                            reject(error)
                        }
                    });
                } else {
                    setTimeout(() => {
                        try {
                            const result = onRejected(this.data);
                            if (result instanceof Promise) {
                                result.then(
                                    value => resolve(value),
                                    reason => reject(reason)
                                )
                            } else {
                                resolve(result);
                            }
                        } catch (error) {
                            reject(error)
                        }
                    });
                }
            })
        }

        Promise.prototype.catch = function (onRejected) {
            return this.then(undefined, onRejected);
        }

        Promise.resolve = function (value) {
            return new Promise((resolve, reject) => {
                if (value instanceof Promise) {
                    value.then(resolve, reject)
                } else {
                    resolve(value);
                }
            })
        }

        Promise.reject = function (reason) {
            return new Promise((resolve, reject) => {
                reject(reason);
            })
        }

        Promise.all = function (promises) {
            const values = [];
            let count = 0; // 记录成功的个数
            return new Promise((reslove, reject) => {
                promises.forEach(peomise => {
                    peomise.then((value) => {
                        values.push(values);
                        count++;
                    }, (reason) => {
                        reject(reason)
                    });
                });
                if (count === promises.length) {
                    reslove(values)
                }
            })
        }

        Promise.reace = function (promises) {
            return new Promise((reslove,reject)=>{
                promises.forEach(promise => {
                    promise.then((value)=>{
                        reslove(value);
                    },(reason)=>{
                        reject(reason);
                    })
                });
            })
        }
    }
)()
