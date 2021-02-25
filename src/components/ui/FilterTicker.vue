<template>
  <div>
    <LabelInput
      :value="modelValue"
      :hasError="hasError"
      :helper="helper"
      @input="inputHandler"
      label="Фильтр тикеров"
      placeholder="Например DOGE"
      errorMessage="Такого тикера не существует"
    />

    <div class="flex">
      <button
        :disabled="isStartPage"
        :class="{ 'opacity-40': isStartPage }"
        @click="stepBack"
        type="button"
        class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Назад
      </button>
      <button
        :disabled="isMaxPage"
        :class="{ 'opacity-40': isMaxPage }"
        @click="stepForward"
        type="button"
        class="my-4 ml-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Вперёд
      </button>
    </div>
  </div>
</template>

<script>
// mixins
import inputInterface from '@/mixins/input-interface.mixin';

// components
import LabelInput from '@/components/inputs/LabelInput';

export default {
  props: {
    page: {
      type: Number,
      default: 0,
    },
    maxPageCount: {
      type: Number,
      default: 0,
    },
    modelValue: {
      type: String,
      default: '',
    },
  },
  components: {
    LabelInput,
  },
  mixins: [inputInterface],
  computed: {
    isStartPage() {
      return this.page === 0;
    },
    isMaxPage() {
      return this.page === this.maxPageCount;
    },
  },
  methods: {
    stepBack() {
      if (this.isStartPage) {
        return;
      }
      this.$emit('update:page', this.page - 1);
    },
    stepForward() {
      if (this.isMaxPage) {
        return;
      }
      this.$emit('update:page', this.page + 1);
    },
  },
};
</script>

<style></style>
