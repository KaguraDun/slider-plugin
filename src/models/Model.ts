class Model {
  from: number;
  max: number;
  min: number;
  step: number;

  constructor() {
    this.from = 0;
    this.min = 0;
    this.max = 100;
    this.step = 10;
  }

  setMin(value: number) {
    this.min = value;
  }

  getMin() {
    return this.min;
  }

  setMax(value: number) {
    this.max = value;
  }

  getMax() {
    return this.max;
  }

  setFrom(value: number) {
    this.from = value;
  }

  getFrom() {
    return this.from;
  }

  setStep(value: number) {
    this.step = value;
  }

  getStep() {
    return this.step;
  }
}

export default Model;
