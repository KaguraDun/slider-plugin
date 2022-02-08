function getPercentOfNumber(firstNumber: number, secondNumber: number) {
  if (secondNumber === 0) return 0;
  return (firstNumber / secondNumber) * 100;
}

export default getPercentOfNumber;
