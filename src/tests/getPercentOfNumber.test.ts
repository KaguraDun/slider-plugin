import getPercentOfNumber from '@/helpers/getPercentOfNumber';

describe('getPercentOfNumber', () => {
  it('should return 10', () => {
    const percentOfNumber = getPercentOfNumber(10, 100);
    expect(percentOfNumber).toEqual(10);
  });

  it('should return 0 when first number is 0', () => {
    const percentOfNumber = getPercentOfNumber(0, 100);
    expect(percentOfNumber).toEqual(0);
  });

  it('should return 0 when second number is 0', () => {
    const percentOfNumber = getPercentOfNumber(100, 0);
    expect(percentOfNumber).toEqual(0);
  });

  it('should return 100', () => {
    const percentOfNumber = getPercentOfNumber(100, 100);
    expect(percentOfNumber).toEqual(100);
  });
});
