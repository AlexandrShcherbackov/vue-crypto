<template>
  <div>
    <LabelInput
      :value="modelValue"
      :hasError="hasError"
      :helper="helper"
      @input="inputHandler"
      label="Тикер"
      placeholder="Например DOGE"
      errorMessage="Такой тикер уже добавлен"
    />
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
  </div>
</template>

<script>
// mixins
import inputInterface from '@/mixins/input-interface.mixin';

// components
import LabelInput from '@/components/inputs/LabelInput';

export default {
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  components: {
    LabelInput,
  },
  mixins: [inputInterface],
  methods: {
    addTicker() {
      this.$emit('add');
      this.$nextTick(this.$emit('update:modelValue', ''));
    },
    inputHandler(v) {
      const newVal = typeof v === 'object' ? v.target.value : v;
      this.$emit('update:modelValue', newVal);
    },
  },
};
</script>

<style></style>
