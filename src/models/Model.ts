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

    this.observerEvents.stateChanged.notify(this.state);
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
    return this.state;
  }

  setMin(min: number) {
    this.setState({ min });
    this.generateValues();
  }

  getMin() {
    return this.state.min;
  }

  setMax(max: number) {
    this.setState({ max });
    this.generateValues();
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

    const isToIndexSet = toIndex !== undefined;
    if (isRange && isToIndexSet && fromIndex > toIndex) fromIndex = toIndex;

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
    const { toIndex = this.state.maxIndex } = this.state;

    return this.state.values[toIndex];
  }

  setStep(step: number) {
    this.setState({ step });
    this.generateValues();
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
    sequence.push(max);

    return sequence;
  }

  private generateValues() {
    const { min, max, step, fromIndex, toIndex } = this.state;

    if (step <= 0) return;

    const maxIndex = Math.ceil(Math.abs((max - min) / step));

    if (fromIndex > maxIndex) this.state.fromIndex = maxIndex;
    if (toIndex !== undefined && toIndex > maxIndex)
      this.state.toIndex = maxIndex;

    this.state.maxIndex = maxIndex;
    this.state.values = this.generateNumberSequence({
      maxIndex,
      min,
      max,
      step,
    });
  }
}

export default Model;
