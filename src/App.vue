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
            :helper="tickersHelper"
            @addTicker="addTicker"
          />

          <FilterTicker
            v-model:modelValue="tickerFilter"
            v-model:page="currentPage"
            class="ml-8"
          />
        </div>
      </section>

      <template v-if="!!currsForRender.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <CurrencyGrid
          :currencies="currsForRender"
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
  async mounted() {
    const tickers = JSON.parse(localStorage.getItem('crypto-tickers'));

    if (tickers) {
      this.tickers = tickers;
    } else {
      this.tickers.bases.push(this.currentTicker);
      localStorage.setItem('crypto-tickers', JSON.stringify(this.tickers));
    }

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
      const startIndex = this.currentPage * 6;
      const endIndex = (this.currentPage + 1) * 6;
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
        )
        .slice(startIndex, endIndex);
    },

    currentHistory() {
      return this.currenciesHistory.find(
        ({ base }) => base === this.currentCurr
      )?.values;
    },

    tickersHelper() {
      return this.currentTicker
        ? this.allTickers.filter((i) =>
            i.includes(this.currentTicker.toUpperCase())
          )
        : [];
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
