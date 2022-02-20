function getDecimalPlaces(value: number) {
  const [, decimalPlaces] = String(value).split('.');
  return decimalPlaces !== undefined ? decimalPlaces.length : 0;
}

export default getDecimalPlaces;
