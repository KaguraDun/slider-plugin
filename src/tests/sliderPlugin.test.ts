import $ from 'jquery';

import SliderSettings from '@/models/SliderSetting';
import SliderMethods from '@/ts/SliderMethods';
import '@/ts/slider';

describe('Slider', () => {
  let $slider: SliderMethods;

  it('show error message in console when parent not found', () => {
    window.console.log = jest.fn(() => true);

    const sliderOptions = {
      min: -10,
      max: 10,
      from: 0,
    };

    const notExistedElement = document.querySelector('.not-existed-element');
    // @ts-ignore
    $(notExistedElement).createSlider(sliderOptions);

    expect(window.console.log).toHaveBeenCalled();
  });

  it('show error message in console when minimum parameters not passed', () => {
    window.console.log = jest.fn(() => true);

    const sliderOptions: Partial<SliderSettings> = {
      from: 0,
    };

    const parent = document.createElement('div');
    document.body.append(parent);

    // @ts-ignore
    $(parent).createSlider(sliderOptions);

    expect(window.console.log).toHaveBeenCalled();
  });

  beforeEach(() => {
    const sliderOptions = {
      min: -10,
      max: 10,
      from: 0,
    };

    const parent = document.createElement('div');
    document.body.append(parent);

    $slider = $(parent).createSlider(sliderOptions);
  });

  it('should render', () => {
    expect(document.querySelector('.slider')).toBeInTheDocument();
  });

  it('should set min', () => {
    $slider.setMin(-100);
    expect($slider.getMin()).toEqual(-100);
  });

  it('should set max', () => {
    $slider.setMax(100);
    expect($slider.getMax()).toEqual(100);
  });

  it('should set step', () => {
    $slider.setStep(5);
    expect($slider.getStep()).toEqual(5);
  });

  it('should set from value', () => {
    expect($slider.getFrom()).toEqual(0);
  });

  it('should set to value', () => {
    $slider.setTo(5);
    expect($slider.getTo()).toEqual(5);
  });

  it('should set isRange', () => {
    $slider.setIsRange(true);
    expect($slider.getIsRange()).toEqual(true);
  });

  it('should set isVertical', () => {
    $slider.setIsVertical(true);
    expect($slider.getIsVertical()).toEqual(true);
  });

  it('should set show bar', () => {
    $slider.setShowBar(true);
    expect($slider.getShowBar()).toEqual(true);
  });

  it('should set show tip', () => {
    $slider.setShowTip(true);
    expect($slider.getShowTip()).toEqual(true);
  });

  it('should set show scale', () => {
    $slider.setShowScale(true);
    expect($slider.getShowScale()).toEqual(true);
  });

  it('should call callback when from changed', () => {
    const callback = jest.fn(() => true);

    $slider.fromChangedEvent(callback);
    $slider.setFrom(3);

    expect(callback).toHaveBeenCalled();
  });

  it('should call callback when to changed', () => {
    const callback = jest.fn(() => true);

    $slider.toChangedEvent(callback);
    $slider.setTo(9);

    expect(callback).toHaveBeenCalled();
  });
});
