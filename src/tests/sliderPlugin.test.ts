import $ from 'jquery';

import SliderSettings from '@/models/SliderSetting';
import SliderMethods from '@/ts/SliderMethods';
import '@/ts/slider';

describe('Slider', () => {
  let $slider: SliderMethods;
  window.console.log = jest.fn();

  it('show error message in console when parent not found', () => {
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

  it('show error message when passing invalid option', () => {
    const sliderOptions: Partial<SliderSettings> = {
      min: -10,
      max: 10,
      from: 0,
      // @ts-ignore
      notValidOption: 'notValidOption',
    };

    const parent = document.createElement('div');
    document.body.append(parent);

    // @ts-ignore
    $(parent).createSlider(sliderOptions);

    expect(window.console.log).toHaveBeenCalled();
  });

  it('show error message in console when minimum parameters not passed', () => {
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
    const callback = jest.fn();

    $slider.fromChangedEvent(callback);
    $slider.setFrom(3);

    expect(callback).toHaveBeenCalled();
  });

  it('should call callback when to changed', () => {
    const callback = jest.fn();

    $slider.toChangedEvent(callback);
    $slider.setTo(9);

    expect(callback).toHaveBeenCalled();
  });

  it('should return array of values', () => {
    const values = $slider.getValues();
    const sliderValues = [
      -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ];
    expect(values).toEqual(sliderValues);
  });

  it('should set multiple options', () => {
    $slider.setOptions({
      min: -100,
      max: 100,
      step: 25,
    });

    expect($slider.getMin()).toEqual(-100);
    expect($slider.getMax()).toEqual(100);
    expect($slider.getStep()).toEqual(25);
  });
});
