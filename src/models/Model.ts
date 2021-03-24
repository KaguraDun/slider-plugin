class Model {
  from: number;
  max: number;
  min: number;

  constructor() {
    this.from = 0;
    this.min = 0;
    this.max = 100;
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
}

export default Model;
