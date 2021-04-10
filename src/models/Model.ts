class Model {
  private from: number;
  private max: number;
  private min: number;
  private step: number;
  private to: number;
  private vertical: boolean;
  private Range: boolean;
  private showScale: boolean;
  private showTip: boolean;
  private showBar: boolean;

  constructor() {
    this.from = 25;
    this.min = 0;
    this.max = 50;
    this.step = 10;
    this.to = 0;
    this.showScale = true;
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

  getShowScale() {
    return this.showScale;
  }

  setShowScale(show: boolean) {
    this.showScale = show;
  }
}

export default Model;
