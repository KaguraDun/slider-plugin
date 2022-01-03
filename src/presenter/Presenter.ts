import DEFAULT_OPTIONS from '@/models/defaultSettings';
import Model from '@/models/Model';
import sliderErrors from '@/models/sliderErrors';
import SliderSettings from '@/models/SliderSetting';
import { ObserverEvents } from '@/observer/ObserverEvents';
import View from '@/views/View';

import '@/styles/slider.scss';

class Presenter {
  observerEvents: ObserverEvents;
  model: Model;
  view: View;
  fromChangedCallback: () => void;
  toChangedCallback: () => void;

  constructor() {
    this.observerEvents = new ObserverEvents();
    this.model = new Model(this.observerEvents);
    this.view = new View(this.observerEvents);
    this.fromChangedCallback = () => null;
    this.toChangedCallback = () => null;
  }

  createSlider(
    container: HTMLElement,
    options: SliderSettings = DEFAULT_OPTIONS,
  ) {
    const { from, to, ...restOptions } = options;

    if (!container) {
      sliderErrors.throwContainerNotFound();
      return;
    }

    if (options || restOptions) {
      this.model.setOptions(restOptions);
    } else {
      this.model.setDefaultSettings();
    }

    if (from) this.model.setFrom(from);
    if (to) this.model.setTo(to);

    this.view.init(container, this.model.getState());

    this.observerEvents.stateChanged.attach(this.view.update);

    this.observerEvents.fromChanged.attach(this.runFromChangedCallback);
    this.observerEvents.fromChanged.attach(this.view.setTopThumb);

    this.observerEvents.toChanged.attach(this.runToChangedCallback);
    this.observerEvents.toChanged.attach(this.view.setTopThumb);

    this.observerEvents.thumbMoved.attach(this.model.setOptions);
    this.observerEvents.scaleClick.attach(this.model.setOptions);
  }

  addFromChangedCallback(callback: () => void) {
    this.fromChangedCallback = callback;
  }

  addToChangedCallback(callback: () => void) {
    this.toChangedCallback = callback;
  }

  setFrom(from: number) {
    this.model.setFrom(from);
  }

  getFrom() {
    return this.model.getFrom();
  }

  setTo(to: number) {
    this.model.setTo(to);
  }

  getTo() {
    return this.model.getTo();
  }

  setShowScale(show: boolean) {
    this.model.setShowScale(show);
  }

  getShowScale() {
    return this.model.getShowScale();
  }

  setShowTip(show: boolean) {
    this.model.setShowTip(show);
  }

  getShowTip() {
    return this.model.getShowTip();
  }

  setShowBar(show: boolean) {
    this.model.setShowBar(show);
  }

  getShowBar() {
    return this.model.getShowBar();
  }

  setIsRange(isRange: boolean) {
    this.model.setIsRange(isRange);
  }

  getIsRange() {
    return this.model.getIsRange();
  }

  setIsVertical(isVertical: boolean) {
    this.model.setIsVertical(isVertical);
  }

  getIsVertical() {
    return this.model.getIsVertical();
  }

  setMin(min: number) {
    this.model.setMin(min);
  }

  getMin() {
    return this.model.getMin();
  }

  setMax(max: number) {
    this.model.setMax(max);
  }

  getMax() {
    return this.model.getMax();
  }

  setStep(step: number) {
    this.model.setStep(step);
  }

  getStep() {
    return this.model.getStep();
  }

  private runFromChangedCallback = () => {
    this.fromChangedCallback();
  };

  private runToChangedCallback = () => {
    this.toChangedCallback();
  };
}

export default Presenter;
