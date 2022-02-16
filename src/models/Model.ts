import { ObserverEvents } from '@/observer/ObserverEvents';

import sliderErrors from './sliderErrors';
import SliderSettings from './SliderSetting';
import SliderState from './SliderState';
import ThumbID from './ThumbID';

class Model {
  private observerEvents: ObserverEvents;
  private state: SliderState;

  constructor(observerEvents: ObserverEvents) {
    this.observerEvents = observerEvents;
    this.state = {
      fromIndex: 0,
      min: 0,
      max: 0,
      maxIndex: 0,
      step: 1,
      toIndex: undefined,
      values: [],
      showBar: false,
      showScale: false,
      showTip: false,
      isRange: false,
      isVertical: false,
    };
  }

  setOptions = (settings: Partial<SliderSettings>) => {
    const { from, to, ...rest } = settings;

    Object.entries(rest).forEach(
      ([setting, value]: [string, number | boolean]) => {
        if (this.state.hasOwnProperty(setting)) {
          Object.assign(this.state, { [setting]: value });
        }
      },
    );

    this.generateValues();
    this.setFrom(Number(from));

    if (to !== undefined) {
      this.setTo(Number(to));
    } else {
      this.setTo(Number(this.state.max));
    }

    this.observerEvents.stateChanged.notify(this.getState());
  };

  setThumb = (thumbID: Partial<SliderSettings>) => {
    const [thumb] = Object.keys(thumbID);

    if (thumb === ThumbID.from) {
      this.setFrom(Number(thumbID.from));
      return;
    }

    if (thumb === ThumbID.to) this.setTo(Number(thumbID.to));
  };

  getState() {
    return { ...this.state };
  }

  setMin(min: number) {
    this.setState({ min });
    this.generateValues();
    this.updateRangeValues();
    this.checkThumbSwap();
  }

  getMin() {
    return this.state.min;
  }

  setMax(max: number) {
    this.setState({ max });
    this.generateValues();
    this.updateRangeValues();
    this.checkThumbSwap();
  }

  getMax() {
    return this.state.max;
  }

  setFrom(from: number) {
    const { min, max, isRange, toIndex, values, maxIndex } = this.getState();
    let fromIndex = values.indexOf(Number(from));

    if (fromIndex === -1) {
      sliderErrors.throwOptionOutOfRange(ThumbID.from, min, max);
      fromIndex = 0;
    }

    if (fromIndex > maxIndex) fromIndex = maxIndex;

    const isToIndexSet = isRange && toIndex !== undefined;
    const shouldEqualizeFromWithTo = isToIndexSet && fromIndex > toIndex;
    if (shouldEqualizeFromWithTo) fromIndex = toIndex;

    this.setState({ fromIndex });
    this.observerEvents.fromChanged.notify({
      [ThumbID.from]: from,
    });
  }

  getFrom() {
    return this.state.values[this.state.fromIndex];
  }

  setTo(to: number) {
    const { min, max, isRange, fromIndex, maxIndex, values } = this.getState();
    let toIndex = values.indexOf(Number(to));

    if (toIndex === -1) {
      sliderErrors.throwOptionOutOfRange(ThumbID.to, min, max);
      toIndex = maxIndex;
    }

    if (toIndex > maxIndex) toIndex = maxIndex;

    const shouldEqualizeToWithFrom = isRange && toIndex <= fromIndex;
    if (shouldEqualizeToWithFrom) toIndex = fromIndex;

    this.setState({ toIndex });
    this.observerEvents.toChanged.notify({
      [ThumbID.to]: to,
    });
  }

  getTo() {
    const { toIndex = this.getState().maxIndex } = this.getState();

    return this.state.values[toIndex];
  }

  setStep(step: number) {
    this.setState({ step });
    this.generateValues();
    this.updateRangeValues();
  }

  getStep() {
    return this.state.step;
  }

  setShowScale(showScale: boolean) {
    this.setState({ showScale });
  }

  getShowScale() {
    return this.state.showScale;
  }

  setShowTip(showTip: boolean) {
    this.setState({ showTip });
  }

  getShowTip() {
    return this.state.showTip;
  }

  setShowBar(showBar: boolean) {
    this.setState({ showBar });
  }

  getShowBar() {
    return this.state.showBar;
  }

  setIsRange(isRange: boolean) {
    this.checkThumbSwap();

    this.setState({ isRange });
  }

  getIsRange() {
    return this.state.isRange;
  }

  setIsVertical(isVertical: boolean) {
    this.setState({ isVertical });
  }

  getIsVertical() {
    return this.state.isVertical;
  }

  private updateRangeValues() {
    const { isRange, values, fromIndex, toIndex, maxIndex } = this.getState();

    let from = fromIndex > maxIndex ? maxIndex : fromIndex;
    this.setFrom(values[from]);

    const shouldUpdateTo = isRange && toIndex !== undefined;
    if (shouldUpdateTo) {
      let to = toIndex > maxIndex ? maxIndex : toIndex;
      this.setTo(values[to]);
    }
  }

  private checkThumbSwap() {
    const { fromIndex, toIndex } = this.getState();

    const shouldSwapThumbs = toIndex !== undefined && toIndex < fromIndex;

    if (shouldSwapThumbs) {
      this.swapThumbValues();
    }
  }

  private swapThumbValues() {
    const { values, fromIndex, toIndex } = this.getState();
    if (toIndex === undefined) return;

    this.setTo(values[fromIndex]);
    this.setFrom(values[toIndex]);
  }

  private setState(newState: Partial<SliderState>) {
    Object.assign(this.state, newState);

    this.observerEvents.stateChanged.notify(this.getState());
  }

  private generateNumberSequence({
    maxIndex,
    min,
    max,
    step,
  }: Pick<SliderState, 'maxIndex' | 'min' | 'max' | 'step'>) {
    const decimalPlaces = String(step).split('.')[1]?.length;

    const generateFn = (_value: null, index: number) => {
      let result = min + index * step;

      if (decimalPlaces !== undefined) {
        result = Number(result.toFixed(decimalPlaces));
      }

      return result;
    };

    const sequence = Array.from(Array(maxIndex), generateFn);

    // Add the last value separately because we don't need to adjust the values ​​to the step
    sequence.push(max);

    return sequence;
  }

  private generateValues() {
    const { min, max, step } = this.getState();

    if (step <= 0) return;

    const maxIndex = Math.ceil(Math.abs((max - min) / step));
    const values = this.generateNumberSequence({
      maxIndex,
      min,
      max,
      step,
    });

    this.setState({ maxIndex });
    this.setState({ values });
  }
}

export default Model;
