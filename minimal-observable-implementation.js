class Observable {
  constructor(subscribe) {
    this._subscribe = subscribe;
  }
  subscribe(observer) {
    return this._subscribe(observer);
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
