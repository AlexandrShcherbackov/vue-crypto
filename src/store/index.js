import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    currencies: [],
  },
  getters: {
    getCurrencies({ currencies }) {
      return currencies;
    },
  },
  mutations: {
    setCurrencies(state, payload) {
      state.currencies = payload;
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
      });
    },
  },
  modules: {},
});
