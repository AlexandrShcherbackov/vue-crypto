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
        @click="stepBack"
        type="button"
        class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Назад
      </button>
      <button
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
  components: {
    LabelInput,
  },
  mixins: [inputInterface],
  methods: {
    inputHandler(v) {
      console.log(v);
    },
    stepBack() {},
    stepForward() {},
  },
};
</script>

<style></style>
