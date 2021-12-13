import { ObserverEvents } from '@/observer/ObserverEvents';
import SliderSettings from './SliderSetting';
import sliderErrors from './sliderErrors';

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
    const { maxIndex, min, stepIndex } = this.state;

    return Array.from(Array(maxIndex), (value, index) =>
      String(min + index * stepIndex),
    );
  }

  generateValues() {
    const { min, max, stepIndex } = this.state;
    this.maxIndex = (max - min) / stepIndex + 1;

    this.state.values = this.generateNumberSequence();

    // if (!this.state.generatorFunction) return;

    // this.state.values = this.state.generatorFn();
  }

  setOptions(options: SliderSettings) {
    Object.entries(options).forEach(
      ([option, value]: [string, number | boolean]) => {
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

  setFrom(from: string) {
    const { min, max } = this.state;
    const fromIndex = this.state.values.indexOf(from);

    if (fromIndex === -1) {
      sliderErrors.throwOptionOutOfRange('from', min, max);
      return;
    }

    this.setOptions({ fromIndex });
  }

  getFrom() {
    return this.state.values[this.state.fromIndex];
  }

  setTo(to: number) {
    const { min, max } = this.state;
    const toIndex = this.state.values.indexOf(to);

    if (toIndex === -1) {
      sliderErrors.throwOptionOutOfRange('to', min, max);
      return;
    }

    this.setOptions({ toIndex });
  }

  getTo() {
    return this.state.values[this.state.toIndex];
  }

  setStep(step: number) {
    this.setOptions({ step });
  }

  getStep() {
    return this.state.step;
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
