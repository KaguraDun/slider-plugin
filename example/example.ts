import $ from 'jquery';

import '@/ts/slider';

import SliderContainer from './components/SliderContainer/SliderContainer';
import SliderPanel from './components/SliderPanel/SliderPanel';
import './styles/example.scss';

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

const firstSliderContainer = new SliderContainer('First slider', {
  width: 'large',
}).render();

const $firstSlider = $(firstSliderContainer.slider).createSlider(
  firstSliderSettings,
);

const firstSliderPanel = new SliderPanel({
  $slider: $firstSlider,
  container: firstSliderContainer.panel,
});
firstSliderPanel.render();

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

const secondSliderContainer = new SliderContainer('Second slider').render();
const $secondSlider = $(secondSliderContainer.slider).createSlider(
  secondSliderSettings,
);

const secondSliderPanel = new SliderPanel({
  $slider: $secondSlider,
  container: secondSliderContainer.panel,
});
secondSliderPanel.render();

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

const thirdSliderContainer = new SliderContainer('Third slider').render();
const $thirdSlider = $(thirdSliderContainer.slider).createSlider(
  thirdSliderSettings,
);

const thirdSliderPanel = new SliderPanel({
  $slider: $thirdSlider,
  container: thirdSliderContainer.panel,
});
thirdSliderPanel.render();

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

const fourthSliderContainer = new SliderContainer('Fourth slider').render();
const $fourthSlider = $(fourthSliderContainer.slider).createSlider(
  fourthSliderSettings,
);

const fourthSliderPanel = new SliderPanel({
  $slider: $fourthSlider,
  container: fourthSliderContainer.panel,
});
fourthSliderPanel.render();
