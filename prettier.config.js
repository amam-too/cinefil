/** @type {import("prettier").Config & import("prettier-plugin-tailwindcss").PluginOptions} */
const config = {
  bracketSpacing: true,
  plugins: ["prettier-plugin-tailwindcss"],
  semi: true,
  singleQuote: false,
  tabWidth: 4,
  trailingComma: "all",
  useTabs: true,
};

export default config;
