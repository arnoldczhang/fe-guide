/**
 * jsx为所欲为
 */
import PropTypes from 'prop-types';

const Sum = (...args) => args.reduce((a, b) => a + b, 0);
const Pow = ({ exponent }, base) => (base ** exponent);
const Sqrt = x => Math.sqrt(x);

const Hypotenuse = ({ a, b }) => (
  <Sqrt>
    <Sum>
      <Pow exponent={2}>{a}</Pow>
      <Pow exponent={2}>{b}</Pow>
    </Sum>
  </Sqrt>
);

Hypotenuse.propTypes = {
  a: PropTypes.number.isRequired,
  b: PropTypes.number.isRequired,
};

/** @jsx calc */
function calc(operation, props, ...args) {
  let params = props ? [props] : [];
  params = params.concat(...args);
  return operation(...params);
}

console.log(<Hypotenuse a={3} b={4} />);
