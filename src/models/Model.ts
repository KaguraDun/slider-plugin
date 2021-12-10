import { ObserverEvents } from '@/observer/ObserverEvents';
import SliderSettings from './SliderSetting';

class Model {
  private observerEvents: ObserverEvents;
  private state: SliderSettings;

  constructor(observerEvents: ObserverEvents) {
    this.observerEvents = observerEvents;
    this.state = {
      from: 50,
      min: 0,
      max: 100,
      step: 10,
      to: 40,
      showBar: true,
      showScale: true,
      showTip: true,
      isRange: false,
      isVertical: false,
    };

    this.observerEvents.stateChanged.notify(this.state);
  }

  setOptions(options: SliderSettings) {
    Object.entries(options).forEach(
      ([option, value]: [string, number | boolean]) => {
        if (this.state.hasOwnProperty(option)) {
          Object.assign(this.state, { [option]: value });
        }
      },
    );

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

  setFrom(from: number) {
    this.setOptions({ from });
  }

  getFrom() {
    return this.state.from;
  }

  setTo(to: number) {
    this.setOptions({ to });
  }

  getTo() {
    return this.state.to;
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
