const actions = new Rx.subject();

actions
  .scan(
    (lastState, action) => {
      if (action.type === "INCREMENT") {
        return {
          counter: lastState.counter + 1,
        };
      } else if (action.type === "DECREMENT") {
        return {
          counter: lastState.counter - 1,
        };
      }
    },
    { counter: 0 }
  )
  .subscribe({
    next(state) {
      React.render(<App state={state} />);
    },
  });
