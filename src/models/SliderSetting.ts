interface SliderSettings {
  from: number;
  min: number;
  max: number;
  step?: number;
  to?: number;
  showBar?: boolean;
  showScale?: boolean;
  showTip?: boolean;
  isRange?: boolean;
  isVertical?: boolean;
}

export default SliderSettings;
