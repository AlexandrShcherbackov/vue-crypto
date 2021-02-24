<template>
  <div class="max-w-xs">
    <label for="wallet" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="mt-1 relative rounded-md shadow-md">
      <input
        :value="modelValue"
        @input="inputHandler($event.target.value)"
        type="text"
        name="wallet"
        id="wallet"
        autocomplete="off"
        class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
        :placeholder="placeholder"
      />
    </div>
    <div
      v-show="!!helper.length"
      class="flex bg-white shadow-md p-1 rounded-md flex-wrap"
    >
      <span
        v-for="item in helper"
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
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
    hasError: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: 'Error message!',
    },
    helper: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    inputHandler(v) {
      this.$emit('update:modelValue', v);
    },
  },
};
</script>

<style></style>
