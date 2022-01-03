interface SliderState {
  fromIndex: number;
  min: number;
  maxIndex: number;
  max: number;
  stepIndex: number;
  toIndex: number;
  values: number[];
  generatorFn: () => number[];
  showBar: boolean;
  showScale: boolean;
  showTip: boolean;
  isRange: boolean;
  isVertical: boolean;
}

export default SliderState;
