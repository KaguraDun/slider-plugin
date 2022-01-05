import ThumbID from '@/models/ThumbID';
import { ObserverEvents } from '@/observer/ObserverEvents';

import sliderErrors from './sliderErrors';
import SliderSettings from './SliderSetting';
import SliderState from './SliderState';

class Model {
  private observerEvents: ObserverEvents;
  private state: SliderState;

  constructor(observerEvents: ObserverEvents) {
    this.observerEvents = observerEvents;
    this.state = {
      fromIndex: 0,
      toIndex: undefined,
      min: undefined,
      max: undefined,
      maxIndex: 0,
      step: 1,
      values: [],
      showBar: false,
      showScale: false,
      showTip: false,
      isRange: false,
      isVertical: false,
    };
  }

  setOptions = (settings: Partial<SliderSettings>) => {
    const { from, to, min, max, ...rest } = settings;

    if (min && max) {
      this.setState({ min, max });
    }

    Object.entries(rest).forEach(
      ([setting, value]: [string, number | boolean]) => {
        if (this.state.hasOwnProperty(setting)) {
          this.setState({ [setting]: value });
        }
      },
    );

    if (from) this.setFrom(from);
    if (to) this.setTo(to);
  };

  getState() {
    return this.state;
  }

  setMin(min: number) {
    this.setState({ min });
  }

  getMin() {
    return this.state.min;
  }

  setMax(max: number) {
    this.setState({ max });
  }

  getMax() {
    return this.state.max;
  }

  setFrom(from: number) {
    const { min, max, isRange, toIndex, maxIndex } = this.state;
    let fromIndex = this.state.values.indexOf(from);

    if (fromIndex === -1) {
      sliderErrors.throwOptionOutOfRange({ option: ThumbID.from, min, max });
      return;
    }

    if (maxIndex && fromIndex > maxIndex) fromIndex = maxIndex;
    if (isRange && toIndex && fromIndex >= toIndex) fromIndex = toIndex;

    this.setState({ fromIndex });
    this.observerEvents.fromChanged.notify({
      [ThumbID.from]: from,
    });
  }

  getFrom() {
    return this.state.values[this.state.fromIndex];
  }

  setTo(to: number) {
    const { min, max, isRange, fromIndex, maxIndex } = this.state;
    let toIndex = this.state.values.indexOf(to);

    if (toIndex === -1) {
      sliderErrors.throwOptionOutOfRange({ option: ThumbID.to, min, max });
      return;
    }

    if (maxIndex && toIndex > maxIndex) toIndex = maxIndex;
    if (isRange && toIndex <= fromIndex) toIndex = fromIndex;

    this.setState({ toIndex });
    this.observerEvents.toChanged.notify({
      [ThumbID.to]: to,
    });
  }

  getTo() {
    if (!this.state.toIndex) return;
    return this.state.values[this.state.toIndex];
  }

  setStep(step: number) {
    this.setState({ step });
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

  private setState(newState: Partial<SliderState>) {
    Object.assign(this.state, newState);

    this.generateValues();
    this.observerEvents.stateChanged.notify(this.state);
  }

  private generateNumberSequence({
    maxIndex,
    min,
    max,
    step,
  }: Pick<SliderState, 'maxIndex' | 'min' | 'max' | 'step'>) {
    const generateFn = (_value: null, index: number) =>
      Number(min) + index * Number(step);

    const sequence = Array.from(Array(maxIndex), generateFn);

    // Add the last value separately because we don't need to adjust the values ​​to the step
    if (max) sequence.push(max);

    return sequence;
  }

  private generateValues() {
    const { min, max, step, fromIndex, toIndex } = this.state;

    if (step <= 0 || !min || !max) return;

    const maxIndex = Math.abs((max - min) / step);

    if (fromIndex > maxIndex) this.state.fromIndex = maxIndex;
    if (toIndex && toIndex > maxIndex) this.state.toIndex = maxIndex;

    this.state.maxIndex = Math.ceil(maxIndex);
    this.state.values = this.generateNumberSequence({
      maxIndex,
      min,
      max,
      step,
    });
  }
}

export default Model;
