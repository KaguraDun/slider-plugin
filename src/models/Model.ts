import ThumbID from '@/models/ThumbID';
import { ObserverEvents } from '@/observer/ObserverEvents';

import sliderErrors from './sliderErrors';
import SliderSettings, { SliderState } from './SliderSetting';

class Model {
  private observerEvents: ObserverEvents;
  private state: SliderSettings;
  constructor(observerEvents: ObserverEvents) {
    this.observerEvents = observerEvents;
    this.state = {
      fromIndex: 0,
      min: -10,
      minIndex: 0,
      max: 10,
      maxIndex: 21,
      stepIndex: 1,
      toIndex: 5,
      values: [],
      generatorFn: this.generateNumberSequence,
      showBar: true,
      showScale: true,
      showTip: true,
      isRange: false,
      isVertical: false,
    };

    this.setOptions = this.setOptions.bind(this);
  }

  generateNumberSequence() {
    const { maxIndex, min, max, stepIndex } = this.state;

    if (!min || !max || !stepIndex) return;

    const generateFn = (value: null, index: number) =>
      Number(min) + index * Number(stepIndex);
    const sequence = Array.from(Array(maxIndex), generateFn);

    // Add the last value separately because we do not need to adjust the values ​​to the step
    sequence.push(max);

    return sequence;
  }

  generateValues() {
    const { min, max, stepIndex, fromIndex, toIndex } = this.state;
    if (!min || !max || !stepIndex || !toIndex) return;
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

  setOptions(options: SliderSettings) {
    Object.entries(options).forEach(
      ([option, value]: [string, number | boolean]) => {
        if (option === ThumbID.from) {
          this.setFrom(value);
          return;
        }

        if (option === ThumbID.to) {
          this.setTo(value);
          return;
        }

        if (this.state.hasOwnProperty(option)) {
          Object.assign(this.state, { [option]: value });
        }
      },
    );

    this.generateValues();

    this.observerEvents.stateChanged.notify(this.state);
  }

  setDefaultSettings() {
    this.state.values = this.generateNumberSequence();
    this.observerEvents.stateChanged.notify(this.state);
  }

  setMin(min: number) {
    this.setOptions({ min });
  }

  getMin() {
    return this.state.min;
  }

  setMax(max: number) {
    this.setOptions({ max });
  }

  getMax() {
    return this.state.max;
  }

  setFrom(from: number | String) {
    const { min, max, isRange, toIndex } = this.state;
    let fromIndex = this.state.values.indexOf(Number(from));

    if (fromIndex === -1) {
      sliderErrors.throwOptionOutOfRange(ThumbID.from, min, max);
      return;
    }

    if (fromIndex > this.state.maxIndex) fromIndex = this.state.maxIndex;
    if (isRange && fromIndex >= toIndex) fromIndex = toIndex;

    this.setOptions({ fromIndex });
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

    this.setOptions({ toIndex });
  }

  getTo() {
    return this.state.values[this.state.toIndex];
  }

  setStep(stepIndex: number) {
    this.setOptions({ stepIndex });
  }

  getStep() {
    return this.state.stepIndex;
  }

  setShowScale(showScale: boolean) {
    this.setOptions({ showScale });
  }

  getShowScale() {
    return this.state.showScale;
  }

  setShowTip(showTip: boolean) {
    this.setOptions({ showTip });
  }

  getShowTip() {
    return this.state.showTip;
  }

  setShowBar(showBar: boolean) {
    this.setOptions({ showBar });
  }

  getShowBar() {
    return this.state.showBar;
  }

  setIsRange(isRange: boolean) {
    this.setOptions({ isRange });
  }

  getIsRange() {
    return this.state.isRange;
  }

  setIsVertical(isVertical: boolean) {
    this.setOptions({ isVertical });
  }

  getIsVertical() {
    return this.state.isVertical;
  }
}

export default Model;
