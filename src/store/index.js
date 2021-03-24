import { createStore } from 'vuex';
import { loadTickersNames, subscribeToUpdateTicker } from '@/api';

const store = createStore({
  state: {
    currencies: [],
    currenciesHistoryData: [],
    tickersHelper: [],
    tickers: new Map(),
  },
  getters: {
    getTickers: ({ tickers }) => Array.from(tickers),
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
    setTickersHelper(state, payload) {
      state.tickersHelper = Object.keys(payload);
    },
    setTicker(state, { ticker, price }) {
      state.tickers.set(ticker, price);
    },
  },
  actions: {
    async loadTickersNames({ commit }) {
      await loadTickersNames().then(({ data: { Data } }) => {
        commit('setTickersHelper', Data);
      });
    },
    subscribeToTicker({ commit }, ticker) {
      subscribeToUpdateTicker(ticker, (data) => commit('setTicker', data));
    },
  },
  modules: {},
});

export default store;
