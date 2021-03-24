import axios from 'axios';

export const loadTickersNames = async () => {
  const apyKey = process.env.VUE_APP_CURRENCY;
  const url = `https://min-api.cryptocompare.com/data/blockchain/list?api_key=${apyKey}`;

  return await axios.get(url);
};

const tickers = new Map();

//TODO refactor to use url search params
const loadTickers = async () => {
  if (tickers.size === 0) {
    return;
  }

  const apyKey = process.env.VUE_APP_CURRENCY;
  const currTickerArr = Object.fromEntries(tickers);
  const currTickerKeys = Object.keys(currTickerArr);
  const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${currTickerKeys.join(
    ','
  )}&tsyms=USD&api_key={${apyKey}}`;
  return await axios.get(url).then(({ data: updatedTicker }) => {
    const keys = Object.keys(updatedTicker);

    keys.forEach((key) => {
      const values = updatedTicker[key];
      const currVal = Object.entries(values);
      const newTickerData = currVal.map((c) => ({
        ticker: `${key}-${c[0]}`,
        price: c[1],
      }));
      const cbs = tickers.get(key);
      newTickerData.forEach((i) => cbs.forEach((cb) => cb(i)));
    });
  });
};

export const subscribeToUpdateTicker = (ticker, cb) => {
  const subs = tickers.get(ticker) || [];
  tickers.set(ticker, [...subs, cb]);
};

export const unsubscribeToTickersUpdate = (ticker) => {
  tickers.delete(ticker);
};

setInterval(loadTickers, 5000);
