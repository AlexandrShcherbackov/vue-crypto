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
      const newVal = typeof v === 'object' ? v.target.value : v;
      this.$emit('update:modelValue', newVal);
    },
  },
};
