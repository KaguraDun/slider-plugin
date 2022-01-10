interface SliderState {
  fromIndex: number;
  min: number;
  maxIndex: number;
  max: number;
  step: number;
  toIndex: number | undefined;
  values: number[];
  showBar: boolean;
  showScale: boolean;
  showTip: boolean;
  isRange: boolean;
  isVertical: boolean;
}

export default SliderState;
