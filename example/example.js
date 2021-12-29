import * as $ from 'jquery';

import createElement from '@/helpers/createElement';

import createSliderControls from './createSliderControls';

import './styles/example.scss';
import '../src/ts/slider';

function createSliderExample({ heading, properties }) {
  const sliderContainer = createElement('div', {
    class: 'slider-example__slider-container',
  });
  const sliderControlsContainer = createElement('div', {
    class: 'slider-example__controls-container',
  });
  const sliderSectionHeading = createElement(
    'div',
    { class: 'slider-example__heading' },
    [heading],
  );
  const sliderWrapper = createElement('div', { class: 'slider-example' }, [
    sliderSectionHeading,
    sliderContainer,
    sliderControlsContainer,
  ]);

  document.body.append(sliderWrapper);

  const $slider = $(sliderContainer).createSlider(properties);
  createSliderControls({
    container: sliderControlsContainer,
    $slider,
  });

  return $slider;
}

const firstSliderProperties = {
  from: 0,
  min: -50,
  max: 50,
  step: 10,
  showBar: true,
  showScale: true,
  showTip: true,
  isRange: false,
  isVertical: false,
};

const $firstSlider = createSliderExample({
  heading: 'First slider',
  properties: firstSliderProperties,
});

const secondSliderProperties = {
  from: 0,
  min: -50,
  max: 50,
  step: 10,
  showBar: true,
  showScale: true,
  showTip: true,
  isRange: true,
  isVertical: true,
};

const $secondSlider = createSliderExample({
  heading: 'Second slider',
  properties: secondSliderProperties,
});

const thirdSliderProperties = {
  from: 0,
  min: -50,
  max: 50,
  step: 10,
  showBar: true,
  showScale: true,
  showTip: true,
  isRange: true,
  isVertical: true,
};

const $thirdSlider = createSliderExample({
  heading: 'Third slider',
  properties: thirdSliderProperties,
});

const fourthSliderProperties = {
  from: 0,
  min: -50,
  max: 50,
  step: 10,
  showBar: true,
  showScale: true,
  showTip: true,
  isRange: true,
  isVertical: true,
};

const $fourthSlider = createSliderExample({
  heading: 'Fourth slider',
  properties: fourthSliderProperties,
});
