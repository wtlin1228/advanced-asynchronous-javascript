class Observable {
  constructor(subscribe) {
    this._subscribe = subscribe;
  }
  subscribe(observer) {
    return this._subscribe(observer);
  }

  retry(num) {
    const self = this;
    return new Observable(function subscribe(observer) {
      let currentSub = null;
      const processRequest = (currentAttemptNumber) => {
        currentSub = self.subscribe({
          next(v) {
            observer.next(v);
          },
          complete() {
            observer.complete();
          },
          error(err) {
            if (currentAttemptNumber === 0) {
              observer.error(err);
            } else {
              processRequest(currentAttemptNumber - 1);
            }
          },
        });
      };

      processRequest(num);

      return {
        unsubscribe() {
          if (currentSub) {
            currentSub.unsubscribe();
          }
        },
      };
    });
  }

  /***
   * Observable.concat(
   *    {---5----7},
   *    {-2---4},
   *    {---5-----9}
   * )
   * -> {---5----7-2---4---5-----9}
   */
  static concat(...observables) {
    return new Observable(function subscribe(observer) {
      let myObservables = observables.slice();
      let currentSub = null;

      let processObservable = () => {
        if (myObservables.length === 0) {
          observer.complete();
        } else {
          let observable = myObservables.shift();
          currentSub = observable.subscribe({
            next(v) {
              observer.next(v);
            },
            error(err) {
              observer.error(err);
              currentSub.unsubscribe();
            },
            complete() {
              processObservable();
            },
          });
        }
      };

      processObservable();

      return {
        unsubscribe() {
          if (currentSub) {
            currentSub.unsubscribe();
          }
        },
      };
    });
  }

  static timeout(time) {
    return new Observable(function subscribe(observer) {
      const handle = setTimeout(() => {
        observer.next();
        observer.complete();
      }, time);

      return {
        unsubscribe() {
          clearTimeout(handle);
        },
      };
    });
  }

  static fromEvent(dom, eventName) {
    return new Observable(function subscribe(observer) {
      const handler = (e) => {
        observer.next(e);
      };
      dom.addEventListener(eventName, handler);

      return {
        unsubscribe() {
          dom.removeEventListener(eventName, handler);
        },
      };
    });
  }

  map(projection) {
    const self = this;
    return new Observable(function subscribe(observer) {
      const subscription = self.subscribe({
        next(v) {
          try {
            observer.next(projection(v));
          } catch (err) {
            observer.error(err);
            subscription.unsubscribe();
          }
        },
        error(err) {
          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });

      return subscription;
    });
  }

  filter(predicate) {
    const self = this;
    return new Observable(function subscribe(observer) {
      const subscription = self.subscribe({
        next(v) {
          try {
            if (predicate(v)) {
              observer.next(v);
            }
          } catch (err) {
            observer.error(err);
            subscription.unsubscribe();
          }
        },
        error(err) {
          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });

      return subscription;
    });
  }
}

// Example
const button = document.getElementById("btn");
const click$ = Observable.fromEvent(button, "click");

click$
  .map((e) => e.offsetX)
  .filter((offsetX) => offsetX >= 10)
  .subscribe({
    next(v) {
      console.log(v);
    },
    error(err) {
      console.log(err);
    },
  });
