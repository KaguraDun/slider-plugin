interface SliderSettings {
  fromIndex: number;
  minIndex: number;
  min?: number;
  maxIndex: number;
  max?: number;
  stepIndex?: number;
  toIndex?: number;
  values?: number[] | string[];
  generatorFn?: () => number[] | string[];
  showBar?: boolean;
  showScale?: boolean;
  showTip?: boolean;
  isRange?: boolean;
  isVertical?: boolean;
}

export default SliderSettings;
