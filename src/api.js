import axios from 'axios';

export const loadCurrencies = async (bases, nominals) => {
  const apyKey = process.env.VUE_APP_CURRENCY;
  const tsyms = nominals.join(',');
  const fsyms = bases.join(',');
  const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${fsyms}&tsyms=${tsyms}&api_key={${apyKey}}`;
  return await axios.get(url).then(({ data }) => Object.entries(data));
};

export const loadTickersNames = async () => {
  const apyKey = process.env.VUE_APP_CURRENCY;
  const url = `https://min-api.cryptocompare.com/data/blockchain/list?api_key=${apyKey}`;

  return await axios.get(url);
};
