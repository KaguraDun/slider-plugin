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

  constructor() {
    this.observerEvents = new ObserverEvents();
    this.model = new Model(this.observerEvents);
    this.view = new View(this.observerEvents);
  }

  createSlider(container: HTMLElement, options?: SliderSettings) {
    const { from, to, ...restOptions } = options;

    if (!container) {
      sliderErrors.throwContainerNotFound();
      return;
    }

    if (options) {
      this.model.setOptions(restOptions);
    } else {
      this.model.setDefaultSettings();
    }

    this.model.setFrom(from);
    if (to) this.model.setTo(to);

    this.view.init(container, this.model.getState());

    this.observerEvents.stateChanged.attach(this.view.update);
    this.observerEvents.thumbMoved.attach(this.model.setOptions);
    this.observerEvents.scaleClick.attach(this.model.setOptions);
  }

  setFrom(from: number) {
    this.model.setFrom(from);
  }

  getFrom() {
    return this.model.getFrom();
  }

  setTo(to: number | string) {
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
}

export default Presenter;
