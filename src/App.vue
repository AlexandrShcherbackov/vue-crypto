<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <Preloader v-show="isLoading" />
    <div class="container">
      <div class="w-full my-4"></div>
      <section>
        <div class="flex">
          <AddTicker
            v-model="currentTicker"
            :hasError="tickerError"
            :helper="allTickers"
            @add="addTickerHandler"
          />

          <FilterTicker
            v-model="tickerFilter"
            v-model:page="currentPage"
            :maxPageCount="maxPageCount"
            :helper="allTickers"
            class="ml-8"
          />
        </div>
      </section>

      <template v-if="!!currentPageCurrs.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <CurrencyGrid
          :currencies="currentPageCurrs"
          :current="currentCurr"
          @delete="deleteHandler"
          @setCurrentCurr="setCurrentCurrHandler"
          class="mt-5"
        />
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>
      <p v-else>Нет ни одной записи</p>

      <CryptoGraph
        v-if="currentCurr"
        :currentCurr="currentCurr"
        :historyData="currentHistory"
        @closeGraph="closeGrapHandler"
      />
    </div>
  </div>
</template>
<script>
// [] 1. При добавлении удалённого тикера в ticker.base добавляется база, которая там есть
// [] 2. Для удалённых пар тиккер - валюта продолжают отправляться запросы на обновление данных

// vuex binding
import { mapActions, mapGetters, mapState } from 'vuex';

//components
import AddTicker from '@/components/ui/AddTicker';
import CurrencyGrid from '@/components/CurrencyGrid';
import CryptoGraph from '@/components/CryptoGraph';
import Preloader from '@/components/Preloader';
import FilterTicker from '@/components/ui/FilterTicker';

// utils
import { locationSeacrParamsObject } from '@/utils/url.helper';

export default {
  components: {
    AddTicker,
    CurrencyGrid,
    CryptoGraph,
    Preloader,
    FilterTicker,
  },
  data() {
    return {
      currentTicker: '',
      currentCurr: '',
      tickers: ['BTC', 'ETH'],
      loadData: null,
      isLoading: false,
      tickerError: false,
      tickerFilter: '',
      currentPage: 0,
    };
  },
  created() {
    this.initializeFilters();
    this.initializeData();
  },
  async mounted() {
    //await this.loadCurrencies(this.tickers);
  },
  unmounted() {},
  computed: {
    ...mapState({
      allTickers: 'tickersHelper',
    }),

    ...mapGetters({
      observedTickers: 'getTickers',
    }),

    currsForRender() {
      return this.observedTickers.map(([ticker, price]) => ({ ticker, price }));
    },

    currentPageCurrs() {
      const startIndex = this.currentPage * 6;
      const endIndex = (this.currentPage + 1) * 6;
      return this.currsForRender.slice(startIndex, endIndex);
    },

    currentHistory() {
      return this.currenciesHistory(this.currentCurr);
    },

    maxPageCount() {
      return Math.floor(this.currsForRender.length / 7);
    },

    navigationData() {
      return {
        tickerFilter: this.tickerFilter,
        currentPage: this.currentPage,
      };
    },
  },
  watch: {
    tickers: {
      deep: true,
      async handler() {},
    },

    tickerFilter() {
      this.currentPage = 0;
    },

    navigationData() {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?tickerFilter=${this.tickerFilter}&currentPage=${this.currentPage}`
      );
    },

    currentPageCurrs() {
      if (this.currentPageCurrs.length === 0 && this.currentPage > 0) {
        this.currentPage -= 1;
      }
    },
  },
  methods: {
    ...mapActions({
      loadCurrencies: 'loadCurrencies',
      loadTickersNames: 'loadTickersNames',
      subscribeToTicker: 'subscribeToTicker',
    }),

    addTickerHandler() {
      // const currs = ['USD', 'EUR', 'RUB'];
      this.subscribeToTicker(this.currentTicker.toUpperCase());
    },

    deleteHandler(delCurr) {
      if (this.currentCurr === delCurr) {
        this.closeGrapHandler();
      }
    },

    setCurrentCurrHandler(v) {
      this.currentCurr = v;
    },

    closeGrapHandler() {
      this.setCurrentCurrHandler(null);
    },

    subscribeToUpdates() {
      if (this.loadData) {
        clearInterval(this.loadData);
      }

      this.isLoading = false;
      this.loadData = setInterval(
        async () => await this.loadCurrencies(this.tickers),
        10000
      );
    },

    initializeFilters() {
      const { tickerFilter, currentPage } = locationSeacrParamsObject();

      this.tickerFilter = tickerFilter ? tickerFilter : '';
      this.currentPage = currentPage ? Number(currentPage) : 0;
    },

    initializeData() {
      const tickers = JSON.parse(localStorage.getItem('crypto-tickers'));
      if (tickers) {
        this.tickers = tickers;
      }
    },
  },
};
</script>
