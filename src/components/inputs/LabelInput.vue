<template>
  <div class="max-w-xs">
    <label for="wallet" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="mt-1 relative rounded-md shadow-md">
      <input
        :value="value"
        @input="inputHandler($event.target.value)"
        type="text"
        autocomplete="off"
        class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
        :placeholder="placeholder"
      />
    </div>
    <div
      v-show="!!hintArray.length"
      class="flex bg-white shadow-md p-1 rounded-md flex-wrap"
    >
      <span
        v-for="item in hintArray"
        :key="item"
        @click="inputHandler(item)"
        class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
      >
        {{ item }}
      </span>
    </div>

    <div v-if="hasError" class="text-sm text-red-600">{{ errorMessage }}</div>
  </div>
</template>

<script>
// mixins
import inputInterface from '@/mixins/input-interface.mixin';

export default {
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
  },
  mixins: [inputInterface],
  computed: {
    hintArray() {
      return this.value
        ? this.helper.filter((i) => i.includes(this.value.toUpperCase()))
        : [];
    },
  },
  methods: {
    inputHandler(v) {
      this.$emit('input', v);
    },
  },
};
</script>

<style></style>
