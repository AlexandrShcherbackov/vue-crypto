<template>
  <div class="max-w-xs">
    <label for="wallet" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="mt-1 relative rounded-md shadow-md">
      <input
        :value="modelValue"
        @input="inputHandler"
        type="text"
        name="wallet"
        id="wallet"
        class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
        :placeholder="placeholder"
      />
    </div>
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
  },
  methods: {
    inputHandler(v) {
      this.$emit('update:modelValue', v.target.value);
    },
  },
};
</script>

<style></style>
