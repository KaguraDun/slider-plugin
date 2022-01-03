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
      min: -10,
      max: 10,
      maxIndex: 21,
      stepIndex: 1,
      toIndex: 20,
      values: [],
      generatorFn: this.generateNumberSequence,
      showBar: true,
      showScale: true,
      showTip: true,
      isRange: false,
      isVertical: false,
    };
  }

  generateNumberSequence() {
    const { maxIndex, min, max, stepIndex } = this.state;

    const generateFn = (_value: null, index: number) =>
      Number(min) + index * Number(stepIndex);
    const sequence = Array.from(Array(maxIndex), generateFn);

    // Add the last value separately because we don't need to adjust the values ​​to the step
    sequence.push(max);

    return sequence;
  }

  generateValues() {
    const { min, max, stepIndex, fromIndex, toIndex } = this.state;

    if (stepIndex <= 0) return;

    const maxIndex = Math.abs((max - min) / stepIndex);
    this.state.maxIndex = Math.ceil(maxIndex);

    if (fromIndex > this.state.maxIndex)
      this.state.fromIndex = this.state.maxIndex;
    if (toIndex > this.state.maxIndex) this.state.toIndex = this.state.maxIndex;

    this.state.values = this.generateNumberSequence();
    // if (!this.state.generatorFunction) return;

    // this.state.values = this.state.generatorFn();
  }

  setOptions = (settings: SliderSettings) => {
    Object.entries(settings).forEach(
      ([setting, value]: [string, number | boolean]) => {
        if (setting === ThumbID.from) {
          this.setFrom(Number(value));
          return;
        }

        if (setting === ThumbID.to) {
          this.setTo(Number(value));
          return;
        }

        if (this.state.hasOwnProperty(setting)) {
          this.setState({ [setting]: value });
        }
      },
    );

    this.generateValues();
  };

  setState(newState: Partial<SliderState>) {
    Object.assign(this.state, newState);

    this.observerEvents.stateChanged.notify(this.state);
  }

  setDefaultSettings() {
    this.state.values = this.generateNumberSequence();
    this.observerEvents.stateChanged.notify(this.state);
  }

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
    const { min, max, isRange, toIndex } = this.state;
    let fromIndex = this.state.values.indexOf(Number(from));

    if (fromIndex === -1) {
      sliderErrors.throwOptionOutOfRange(ThumbID.from, min, max);
      return;
    }

    if (fromIndex > this.state.maxIndex) fromIndex = this.state.maxIndex;
    if (isRange && fromIndex >= toIndex) fromIndex = toIndex;

    this.setState({ fromIndex });
    this.observerEvents.fromChanged.notify({
      [ThumbID.from]: from,
    });
  }

  getFrom() {
    return this.state.values[this.state.fromIndex];
  }

  setTo(to: number) {
    const { min, max, isRange, fromIndex } = this.state;
    let toIndex = this.state.values.indexOf(Number(to));

    if (toIndex === -1) {
      sliderErrors.throwOptionOutOfRange(ThumbID.to, min, max);
      return;
    }

    if (toIndex > this.state.maxIndex) toIndex = this.state.maxIndex;
    if (isRange && toIndex <= fromIndex) toIndex = fromIndex;

    this.setState({ toIndex });
    this.observerEvents.toChanged.notify({
      [ThumbID.to]: to,
    });
  }

  getTo() {
    return this.state.values[this.state.toIndex];
  }

  setStep(stepIndex: number) {
    this.setState({ stepIndex });
  }

  getStep() {
    return this.state.stepIndex;
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
}

export default Model;
