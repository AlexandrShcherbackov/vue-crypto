import { createStore } from 'vuex';
import { loadCurrencies, loadTickersNames } from '@/api';

export default createStore({
  state: {
    currencies: [],
    currenciesHistoryData: [],
    tickers: [],
  },
  getters: {
    getCurrencies({ currencies }) {
      return currencies;
    },
    getCurrenciesHistory({ currenciesHistoryData }) {
      return currenciesHistoryData;
    },
    getTickers({ tickers }) {
      return tickers;
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
    setTickers(state, payload) {
      state.tickers = Object.keys(payload);
    },
  },
  actions: {
    async loadCurrencies({ commit }, { bases, nominals }) {
      await loadCurrencies(bases, nominals).then((currs) => {
        commit('setCurrencies', currs);
        commit('addHistory', currs);
      });
    },
    async loadTickersNames({ commit }) {
      await loadTickersNames().then(({ data: { Data } }) => {
        commit('setTickers', Data);
      });
    },
  },
  modules: {},
});
