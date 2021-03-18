export const locationSeacrParamsObject = () =>
  Object.fromEntries(new URL(window.location).searchParams.entries());
