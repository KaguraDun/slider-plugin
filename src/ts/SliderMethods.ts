interface SliderMethods {
  fromChangedEvent(callback: () => void): SliderMethods;
  toChangedEvent(callback: () => void): SliderMethods;
  setFrom(from: number): SliderMethods;
  getFrom(): number;
  setTo(to: number): SliderMethods;
  getTo(): number;
  setStep(step: number): SliderMethods;
  getStep(): number;
  setMin(min: number): SliderMethods;
  getMin(): number;
  setMax(max: number): SliderMethods;
  getMax(): number;
  setShowTip(show: boolean): SliderMethods;
  getShowTip(): boolean;
  setShowScale(show: boolean): SliderMethods;
  getShowScale(): boolean;
  setShowBar(show: boolean): SliderMethods;
  getShowBar(): boolean;
  setIsRange(isRange: boolean): SliderMethods;
  getIsRange(): boolean;
  setIsVertical(isVertical: boolean): SliderMethods;
  getIsVertical(): boolean;
}

export default SliderMethods;
