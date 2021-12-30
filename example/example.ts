import * as $ from 'jquery';

import createElement from '@/helpers/createElement';

import SliderPanel from './components/SliderPanel/SliderPanel';

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

  const sliderPanel = new SliderPanel({
    $slider,
    container: sliderControlsContainer,
  });

  sliderPanel.render();

  return $slider;
}

const firstSliderSettings = {
  from: 2,
  min: -10,
  max: 10,
  step: 1,
  showBar: true,
  showScale: true,
  showTip: true,
  isRange: false,
  isVertical: false,
};

const $firstSlider = createSliderExample({
  heading: 'First slider',
  properties: firstSliderSettings,
});

const secondSliderSettings = {
  from: -5000,
  to: 2500,
  min: -5000,
  max: 5000,
  step: 5,
  showBar: true,
  showScale: true,
  showTip: true,
  isRange: true,
  isVertical: true,
};

const $secondSlider = createSliderExample({
  heading: 'Second slider',
  properties: secondSliderSettings,
});

// const thirdSliderSettings = {
//   from: 0,
//   min: -50,
//   max: 50,
//   step: 1,
//   showBar: true,
//   showScale: true,
//   showTip: true,
//   isRange: true,
//   isVertical: true,
// };

// const $thirdSlider = createSliderExample({
//   heading: 'Third slider',
//   properties: thirdSliderSettings,
// });

// const fourthSliderSettings = {
//   from: 0,
//   min: -50,
//   max: 50,
//   step: 10,
//   showBar: true,
//   showScale: true,
//   showTip: true,
//   isRange: true,
//   isVertical: true,
// };

// const $fourthSlider = createSliderExample({
//   heading: 'Fourth slider',
//   properties: fourthSliderSettings,
// });
