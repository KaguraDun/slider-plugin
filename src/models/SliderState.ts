interface SliderState {
  fromIndex: number;
  toIndex: number | undefined;
  min: number | undefined;
  max: number | undefined;
  maxIndex: number;
  step: number;
  values: number[];
  showBar: boolean;
  showScale: boolean;
  showTip: boolean;
  isRange: boolean;
  isVertical: boolean;
}

export default SliderState;
