import getDecimalPlaces from '@/helpers/getDecimalPlaces';

describe('getDecimalPlaces', () => {
  it('should return 0', () => {
    const decimalPlaces = getDecimalPlaces(10);
    expect(decimalPlaces).toEqual(0);
  });

  it('should return 1', () => {
    const decimalPlaces = getDecimalPlaces(10.1);
    expect(decimalPlaces).toEqual(1);
  });

  it('should return 10', () => {
    const decimalPlaces = getDecimalPlaces(10.101010101);
    expect(decimalPlaces).toEqual(9);
  });
});
