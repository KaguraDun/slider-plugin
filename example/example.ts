import $ from 'jquery';

import '@/ts/slider';

import SliderPanel from './components/slider-panel/SliderPanel';
import './components/slider-example/slider-example';
import './assets/styles/example.scss';

const sliderContainers = document.querySelectorAll(
  '.js-slider-example__slider-container',
);

const sliderPanels = document.querySelectorAll('.js-slider-panel');

const firstSliderSettings = {
  from: -100,
  to: 100,
  min: -100,
  max: 100,
  showBar: true,
  showScale: true,
  showTip: true,
  isRange: true,
  isVertical: false,
};

const $firstSlider = $(sliderContainers[0]).createSlider(firstSliderSettings);
const firstSliderPanel = new SliderPanel({
  $slider: $firstSlider,
  container: sliderPanels[0],
});
firstSliderPanel.attachEvents();

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

const $secondSlider = $(sliderContainers[1]).createSlider(secondSliderSettings);
const secondSliderPanel = new SliderPanel({
  $slider: $secondSlider,
  container: sliderPanels[1],
});
secondSliderPanel.attachEvents();

const thirdSliderSettings = {
  from: 0,
  min: -10,
  max: 10,
  step: 1,
  showBar: true,
  showScale: true,
  showTip: true,
  isRange: true,
  isVertical: false,
};

const $thirdSlider = $(sliderContainers[2]).createSlider(thirdSliderSettings);
const thirdSliderPanel = new SliderPanel({
  $slider: $thirdSlider,
  container: sliderPanels[2],
});
thirdSliderPanel.attachEvents();

const fourthSliderSettings = {
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

const $fourthSlider = $(sliderContainers[3]).createSlider(fourthSliderSettings);
const fourthSliderPanel = new SliderPanel({
  $slider: $fourthSlider,
  container: sliderPanels[3],
});
fourthSliderPanel.attachEvents();
