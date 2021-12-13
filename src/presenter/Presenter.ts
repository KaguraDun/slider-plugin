import Model from '@/models/Model';
import View from '@/views/View';

import '@/styles/slider.scss';
import SliderSettings from '@/models/SliderSetting';
import sliderErrors from '@/models/sliderErrors';
import { ObserverEvents } from '@/observer/ObserverEvents';

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
    if (!container) {
      sliderErrors.throwContainerNotFound();
      return;
    }

    this.view.init(container);

    if (options) {
      this.model.setOptions(options);
    } else {
      this.model.setDefaultSettings();
    }
  }

  getFrom() {
    return this.model.getFrom();
  }

  setFrom(from: number) {
    this.model.setFrom(from);
  }

  showScale(show: boolean) {
    this.model.setShowScale(show);
  }

  showTip(show: boolean) {
    this.model.setShowTip(show);
  }

  showBar(show: boolean) {
    this.model.setShowBar(show);
  }

  setRange(isRange: boolean) {
    this.model.setIsRange(isRange);
  }

  setVertical(isVertical: boolean) {
    this.model.setIsVertical(isVertical);
  }

  setMin(min: number) {
    this.model.setMin(min);
  }

  setMax(max: number) {
    this.model.setMax(max);
  }

  setStep(step: number) {
    this.model.setStep(step);
  }
}

export default Presenter;
