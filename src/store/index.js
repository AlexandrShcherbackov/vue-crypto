import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    currencies: [],
    currenciesHistoryData: [],
  },
  getters: {
    getCurrencies({ currencies }) {
      return currencies;
    },
    getCurrenciesHistory({ currenciesHistoryData }) {
      return currenciesHistoryData;
    },
  },
  mutations: {
    setCurrencies(state, payload) {
      state.currencies = payload;
    },
    addHistory(state, payload) {
      payload.forEach(([base, nominals]) => {
        const rateKeys = Object.keys(nominals);

        rateKeys.forEach((k) => {
          const curr = `${base} - ${k}`;
          const historicalData = state.currenciesHistoryData.find(
            ({ base: b }) => b === curr
          );

          if (!historicalData) {
            state.currenciesHistoryData.push({
              base: curr,
              values: [nominals[k]],
            });
          } else {
            historicalData.values.push(nominals[k]);
          }
        });
      });
    },
  },
  actions: {
    async loadCurrencies({ commit }, { bases, nominals }) {
      const apyKey = process.env.VUE_APP_CURRENCY;
      const tsyms = nominals.join(',');
      const fsyms = bases.join(',');
      const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${fsyms}&tsyms=${tsyms}&api_key={${apyKey}}`;

      await axios.get(url).then(({ data }) => {
        const currs = Object.entries(data);
        commit('setCurrencies', currs);
        commit('addHistory', currs);
      });
    },
  },
  modules: {},
});
