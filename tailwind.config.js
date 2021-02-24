module.exports = {
  purge: {
    content: ["./public/**/*.html", "./src/**/*.vue"]
  },
  darkMode: false,
  plugins: [require("@tailwindcss/forms")]
};
