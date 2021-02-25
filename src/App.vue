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
            @addTicker="addTicker"
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

      <template v-if="!!currsForRender.length">
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
// vuex binding
import { mapActions, mapGetters } from 'vuex';

//components
import AddTicker from '@/components/ui/AddTicker';
import CurrencyGrid from '@/components/CurrencyGrid';
import CryptoGraph from '@/components/CryptoGraph';
import Preloader from '@/components/Preloader';
import FilterTicker from '@/components/ui/FilterTicker';

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
      tickers: {
        bases: ['BTC', 'ETH'],
        nominals: ['USD', 'EUR'],
      },
      excludeTickers: [],
      loadData: null,
      isLoading: true,
      tickerError: false,
      tickerFilter: '',
      currentPage: 0,
    };
  },
  created() {
    const { tickerFilter, currentPage } = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );

    this.tickerFilter = tickerFilter ? tickerFilter : '';
    this.currentPage = currentPage ? currentPage : 0;

    const tickers = JSON.parse(localStorage.getItem('crypto-tickers'));

    if (tickers) {
      this.tickers = tickers;
    } else {
      this.tickers.bases.push(this.currentTicker);
      localStorage.setItem('crypto-tickers', JSON.stringify(this.tickers));
    }
  },
  async mounted() {
    await this.loadCurrencies(this.tickers);
    await this.loadTickersNames();
    await this.subscribeToUpdates();
  },
  deleted() {
    clearInterval(this.loadData);
  },
  computed: {
    ...mapGetters({
      currencies: 'getCurrencies',
      currenciesHistory: 'getCurrenciesHistory',
      allTickers: 'getTickers',
    }),

    currsForRender() {
      return this.currencies
        .filter(([base]) =>
          this.tickerFilter
            ? base.includes(this.tickerFilter.toUpperCase())
            : true
        )
        .flatMap(([base, nominals]) =>
          Object.keys(nominals)
            .filter(
              (k) =>
                !this.excludeTickers.find(
                  ({ base: b, nominal }) => b === base && nominal === k
                )
            )
            .map((k) => ({
              curr: `${base} - ${k}`,
              value: nominals[k],
            }))
        );
    },

    currentPageCurrs() {
      const startIndex = this.currentPage * 6;
      const endIndex = (this.currentPage + 1) * 6;
      return this.currsForRender.slice(startIndex, endIndex);
    },

    currentHistory() {
      return this.currenciesHistory.find(
        ({ base }) => base === this.currentCurr
      )?.values;
    },

    maxPageCount() {
      return Math.floor(this.currsForRender.length / 6);
    },
  },
  watch: {
    tickers: {
      deep: true,
      async handler(v) {
        await this.loadCurrencies(v);
        await this.subscribeToUpdates();
      },
    },
    tickerFilter() {
      this.currentPage = 0;
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?tickerFilter=${this.tickerFilter}&currentPage=${this.currentPage}`
      );
    },
    currentPage() {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?tickerFilter=${this.tickerFilter}&currentPage=${this.currentPage}`
      );
    },
  },
  methods: {
    ...mapActions({
      loadCurrencies: 'loadCurrencies',
      loadTickersNames: 'loadTickersNames',
    }),

    isTickerAlreadyUse() {
      return !!this.currencies.find(
        ([t]) => t === this.currentTicker.toUpperCase()
      );
    },

    addTicker() {
      if (this.isTickerAlreadyUse()) {
        this.tickerError = true;
        return;
      }

      this.tickerError = false;
      this.tickers.bases.push(this.currentTicker);
      localStorage.setItem('crypto-tickers', JSON.stringify(this.tickers));
    },

    deleteHandler(delCurr) {
      const [base, nominal] = delCurr.split(' - ');
      this.excludeTickers.push({ base, nominal });
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
  },
};
</script>
