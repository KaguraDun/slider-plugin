import * as $ from 'jquery';

import Presenter from '@/presenter/Presenter';
import SliderProperties from '@/models/SliderProperties';

$.fn.createSlider = function (properties: SliderProperties) {
  const [container] = $(this);

  if (!container) {
    throw new Error('slider container not found');
  }

  const slider = new Presenter();
  slider.createSlider(container, properties);

  return {
    setFrom(from: number) {
      slider.setFrom(from);
      return this;
    },
    getFrom() {
      return slider.getFrom();
    },
    setStep(step: number) {
      slider.setStep(step);
      return this;
    },
  };
};
