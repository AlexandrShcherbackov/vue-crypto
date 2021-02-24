<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <div class="w-full my-4"></div>
      <section>
        <div class="flex">
          <LabelInput
            v-model="currentTicker"
            label="Тикер"
            placeholder="Например DOGE"
          />
        </div>
        <button
          @click="addTicker"
          type="button"
          class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <!-- Heroicon name: solid/mail -->
          <svg
            class="-ml-0.5 mr-2 h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="#ffffff"
          >
            <path
              d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            ></path>
          </svg>
          Добавить
        </button>
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
import LabelInput from '@/components/LabelInput';
import CurrencyGrid from '@/components/CurrencyGrid';
import CryptoGraph from '@/components/CryptoGraph';

export default {
  components: {
    LabelInput,
    CurrencyGrid,
    CryptoGraph,
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
    };
  },
  async mounted() {
    await this.loadCurrencies(this.tickers);
    this.loadData = setInterval(
      async () => await this.loadCurrencies(this.tickers),
      10000
    );
  },
  deleted() {
    clearInterval(this.loadData);
  },
  computed: {
    ...mapGetters({
      currencies: 'getCurrencies',
      currenciesHistory: 'getCurrenciesHistory',
    }),
    currsForRender() {
      return this.currencies.flatMap(([base, nominals]) =>
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
    currentHistory() {
      return this.currenciesHistory.find(
        ({ base }) => base === this.currentCurr
      )?.values;
    },
  },
  watch: {
    tickers: {
      deep: true,
      async handler(v) {
        await this.loadCurrencies(v);
      },
    },
  },
  methods: {
    ...mapActions({
      loadCurrencies: 'loadCurrencies',
    }),
    addTicker() {
      this.tickers.bases.push(this.currentTicker);
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
  },
};
</script>
