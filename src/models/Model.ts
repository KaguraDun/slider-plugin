import { ObserverEvents } from '@/observer/ObserverEvents';
import getDecimalPlaces from '@/helpers/getDecimalPlaces';

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
    const { min, max, step, from, to, ...rest } = settings;

    if (min) this.setState({ min });
    if (max) this.setState({ max });
    if (step) this.setStep(step);

    Object.entries(rest).forEach(
      ([option, value]: [string, number | boolean]) => {
        if (this.state.hasOwnProperty(option)) {
          Object.assign(this.state, { [option]: value });
        } else {
          sliderErrors.throwOptionNotValid(option);
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

  setIndex = (index: number) => {
    const { maxIndex, values } = this.getState();
    const isIndexOutOfRange = index < 0 || index > maxIndex;

    if (isIndexOutOfRange) return;

    const closestThumb = this.getClosestThumb(index);

    this.setThumb({ [closestThumb]: values[index] });
  };

  setThumb = (thumbID: Partial<SliderSettings>) => {
    const [thumb] = Object.keys(thumbID);

    if (thumb === ThumbID.from) {
      this.setFrom(thumbID.from!);
      return;
    }

    if (thumb === ThumbID.to) this.setTo(thumbID.to!);
  };

  getState() {
    return { ...this.state };
  }

  setMin(min: number) {
    this.setState({ min });
    this.generateValues();
    this.updateRangeValues();
  }

  getMin() {
    return this.state.min;
  }

  setMax(max: number) {
    this.setState({ max });
    this.generateValues();
    this.updateRangeValues();
  }

  getMax() {
    return this.state.max;
  }

  setFrom(from: number) {
    const { min, max, isRange, toIndex, values } = this.getState();
    let fromIndex = values.indexOf(Number(from));

    if (fromIndex === -1) {
      sliderErrors.throwOptionOutOfRange(ThumbID.from, min, max);
      fromIndex = 0;
    }

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

    const shouldEqualizeToWithFrom = isRange && toIndex <= fromIndex;
    if (shouldEqualizeToWithFrom) toIndex = fromIndex;

    this.setState({ toIndex });
    this.observerEvents.toChanged.notify({
      [ThumbID.to]: to,
    });
  }

  getTo() {
    const { toIndex } = this.getState();
    return this.state.values[toIndex!];
  }

  setStep(step: number) {
    const { min, max } = this.getState();

    let validatedStep = step;

    if (step <= 0) {
      validatedStep = 1;
      sliderErrors.throwStepMustBeAboveZero();
    }

    const diff = Math.abs(max - min);
    if (step > diff) {
      validatedStep = diff;
    }

    this.setState({ step: validatedStep });
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
    this.setState({ isRange });
    this.swapThumbs();
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

  getValues() {
    return [...this.state.values];
  }

  private getClosestThumb(index: number): ThumbID {
    const { isRange, fromIndex, toIndex } = this.getState();

    const isToExist = isRange && toIndex !== undefined;
    if (!isToExist) return ThumbID.from;

    const distanceToFirst = Math.abs(fromIndex - index);
    const distanceToSecond = Math.abs(toIndex - index);

    const isFirstThumb =
      distanceToFirst < distanceToSecond || index < fromIndex;

    if (isFirstThumb) return ThumbID.from;

    return ThumbID.to;
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

  private swapThumbs() {
    const { values, fromIndex, toIndex } = this.getState();
    const shouldSwapThumbs = toIndex !== undefined && toIndex < fromIndex;

    if (shouldSwapThumbs) {
      this.setTo(values[fromIndex]);
      this.setFrom(values[toIndex]);
    }
  }

  private setState(newState: Partial<SliderState>) {
    this.state = { ...this.getState(), ...newState };
    this.observerEvents.stateChanged.notify(this.getState());
  }

  private generateNumberSequence({
    maxIndex,
    min,
    max,
    step,
  }: Pick<SliderState, 'maxIndex' | 'min' | 'max' | 'step'>) {
    const decimalPlaces = Math.max(
      getDecimalPlaces(min),
      getDecimalPlaces(max),
      getDecimalPlaces(step),
    );

    const generateFn = (_value: null, index: number) => {
      let result = min + index * step;

      if (decimalPlaces > 0) {
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
