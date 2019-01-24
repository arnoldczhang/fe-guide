import { button, div, makeDOMDriver, p } from '@cycle/dom';
import { run } from '@cycle/run';
import xs from 'xstream';

function main(sources: any) {
  const action$ = xs.merge(
    sources.DOM.select('.decrement').events('click').map(() => -1),
    sources.DOM.select('.increment').events('click').map(() => +1),
  );

  const count$ = action$.fold((acc: number, x: any): number => {
    return acc + x;
  }, 0);

  const vdom$ = count$.map((count: number) =>
    div([
      button('.decrement', 'Decrement'),
      button('.increment', 'Increment'),
      p('Counter: ' + count),
    ]),
  );

  return {
    DOM: vdom$,
  };
}

run(main, {
  DOM: makeDOMDriver('#main'),
});

export default main;
