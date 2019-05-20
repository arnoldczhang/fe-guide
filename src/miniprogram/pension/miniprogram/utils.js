const calcAll = ({
  lastAvgSalary,
  retireAge,
  accumulate,
  age,
  salary,
  avgRate,
  rate
}) => {
  const base =
    lastAvgSalary *
    (1 +
      ((parseFloat(retireAge) - parseFloat(age)) * parseFloat(avgRate)) / 100) *
    0.2;
  const increasing =
    parseFloat(accumulate) +
    (salary *
      0.08 *
      12 *
      (Math.pow(
        1 + parseFloat(rate) / 100,
        parseFloat(retireAge) - parseFloat(age)
      ) -
        1)) /
      (parseFloat(rate) / 100);
  return (base + increasing / 120).toFixed(2) || 0;
};

module.exports = {
  calcAll
};
