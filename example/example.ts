import $ from 'jquery';

import createElement from '@/helpers/createElement';

import SliderPanel from './components/SliderPanel/SliderPanel';

import './styles/example.scss';
import '../src/ts/slider';

function renderSliderContainer(heading: string) {
  const sliderPanelContainer = createElement('div', {
    class: 'slider-example__controls-container',
  });
  const sliderContainer = createElement('div', {
    class: 'slider-example__slider-container',
  });
  const sliderSectionHeading = createElement(
    'div',
    { class: 'slider-example__heading' },
    [heading],
  );
  const sliderWrapper = createElement('div', { class: 'slider-example' }, [
    sliderSectionHeading,
    sliderContainer,
    sliderPanelContainer,
  ]);

  document.body.append(sliderWrapper);

  return { slider: sliderContainer, panel: sliderPanelContainer };
}

const firstSliderSettings = {
  from: 8,
  to: 8,
  min: -10,
  max: 26,
  step: 1,
  showBar: true,
  showScale: true,
  showTip: true,
  isRange: true,
  isVertical: false,
};

const firstSliderContainer = renderSliderContainer('First slider');
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

const secondSliderContainer = renderSliderContainer('Second slider');
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

const thirdSliderContainer = renderSliderContainer('Third slider');
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

const fourthSliderContainer = renderSliderContainer('Fourth slider');
const $fourthSlider = $(fourthSliderContainer.slider).createSlider(
  fourthSliderSettings,
);

const fourthSliderPanel = new SliderPanel({
  $slider: $fourthSlider,
  container: fourthSliderContainer.panel,
});
fourthSliderPanel.render();
