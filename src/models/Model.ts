class Model {
  private from: number;
  private max: number;
  private min: number;
  private step: number;
  private to: number;
  private isVertical: boolean;
  private isRange: boolean;
  private showScale: boolean;
  private showTip: boolean;
  private showBar: boolean;

  constructor() {
    this.from = 20;
    this.min = 0;
    this.max = 50;
    this.step = 10;
    this.to = 40;
    this.showBar = true;
    this.showScale = true;
    this.showTip = true;
    this.isRange = true;
    this.isVertical = true;
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

  setTo(value: number) {
    this.to = value;
  }

  getTo() {
    return this.to;
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

  getShowTip() {
    return this.showTip;
  }

  setShowTip(show: boolean) {
    this.showTip = show;
  }

  getShowBar() {
    return this.showBar;
  }

  setShowBar(show: boolean) {
    this.showBar = show;
  }

  getIsRange() {
    return this.isRange;
  }

  setIsRange(isRange: boolean) {
    this.isRange = isRange;
  }

  getIsVertical() {
    return this.isVertical;
  }

  setIsVertical(isVertical: boolean) {
    this.isVertical = isVertical;
  }
}

export default Model;
