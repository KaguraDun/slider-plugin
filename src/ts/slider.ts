import $ from 'jquery';

import SliderSettings from '@/models/SliderSetting';
import Presenter from '@/presenter/Presenter';

$.fn.createSlider = function (options: SliderSettings) {
  const container = this[0];
  const slider = new Presenter();

  slider.createSlider(container, options);

  return {
    fromChangedEvent(callback: () => void) {
      slider.addFromChangedCallback(callback);
      return this;
    },
    toChangedEvent(callback: () => void) {
      slider.addToChangedCallback(callback);
      return this;
    },
    setFrom(from: number) {
      slider.setFrom(from);
      return this;
    },
    getFrom() {
      return slider.getFrom();
    },
    setTo(to: number) {
      slider.setTo(to);
      return this;
    },
    getTo() {
      return slider.getTo();
    },
    setStep(step: number) {
      slider.setStep(step);
      return this;
    },
    getStep() {
      return slider.getStep();
    },
    setMin(min: number) {
      slider.setMin(min);
      return this;
    },
    getMin() {
      return slider.getMin();
    },
    setMax(max: number) {
      slider.setMax(max);
      return this;
    },
    getMax() {
      return slider.getMax();
    },
    setShowTip(show: boolean) {
      slider.setShowTip(show);
      return this;
    },
    getShowTip() {
      return slider.getShowTip();
    },
    setShowScale(show: boolean) {
      slider.setShowScale(show);
      return this;
    },
    getShowScale() {
      return slider.getShowScale();
    },
    setShowBar(show: boolean) {
      slider.setShowBar(show);
      return this;
    },
    getShowBar() {
      return slider.getShowBar();
    },
    setIsRange(isRange: boolean) {
      slider.setIsRange(isRange);
      return this;
    },
    getIsRange() {
      return slider.getIsRange();
    },
    setIsVertical(isVertical: boolean) {
      slider.setIsVertical(isVertical);
      return this;
    },
    getIsVertical() {
      return slider.getIsVertical();
    },
    getValues() {
      return slider.getValues();
    },
    setOptions(sliderOptions: Partial<SliderSettings>) {
      slider.setOptions(sliderOptions);
      return this;
    },
  };
};
