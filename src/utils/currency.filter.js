const currencyFilter = (curr) =>
  curr > 1 ? curr.toFixed(2) : curr.toPrecision(2);

export default currencyFilter;
