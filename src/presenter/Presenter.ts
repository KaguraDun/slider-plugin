import Model from '../models/Model';
import View from '../views/View';

import '../styles/slider.scss';
import sliderPropertiesInterface from '../models/SliderProperties';
import sliderPropertiesList from '../models/SliderPropertiesList';

class Presenter {
  model: any;
  view: View;

  constructor() {
    this.model = new Model();
    this.view = new View();
  }

  createSlider(parent: HTMLElement, params?: sliderPropertiesInterface) {
    if (params) this.setSliderParams(params);

    this.view.setParent(parent);
    this.render();
  }

  setSliderParams(params: sliderPropertiesInterface) {
    Object.keys(params).forEach((param: keyof typeof params) => {
      const value = params[param];
      const methodName = sliderPropertiesList[param];

      if (methodName) this.model[methodName](value);
    });
  }

  render() {
    const min = this.model.getMin();
    const max = this.model.getMax();
    const step = this.model.getStep();
    const from = this.model.getFrom();
    const to = this.model.getTo();
    const showScale = this.model.getShowScale();
    const showTip = this.model.getShowTip();
    const showBar = this.model.getShowBar();
    const isRange = this.model.getIsRange();
    const isVertical = this.model.getIsVertical();

    this.view.clearAll();
    this.view.renderTrack(isVertical);

    if (showBar) this.view.renderBar();

    if (isRange) {
      this.view.renderRange(this.handleDragThumb);
    } else {
      this.view.renderThumb(this.handleDragThumb);
    }

    if (showTip) {
      this.view.firstThumb.renderTip(from, isVertical);
      if (isRange) this.view.secondThumb.renderTip(to, isVertical);
    }

    if (showScale) this.view.renderScale({ min, max, step, isVertical });

    this.changeFrom(from);
    if (isRange) this.changeTo(to);
  }

  handleDragThumb = (e: MouseEvent, selectedThumb: any) => {
    e.preventDefault();
    const shiftX = e.clientX - selectedThumb.element.offsetLeft;
    const shiftY = e.clientY - selectedThumb.element.offsetLeft;

    const onMouseMove = (e: MouseEvent) => {
      const offsetX = e.clientX - shiftX;
      const offsetY = e.clientY - shiftY;
      const isFirstThumb = selectedThumb === this.view.firstThumb;

      const offset = this.model.getIsVertical() ? offsetY : offsetX;

      if (isFirstThumb) {
        this.changeFrom(0, offset);
      } else {
        this.changeTo(0, offset);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  getTrackWidthWithoutThumb() {
    const isVertical = this.model.getIsVertical();
    const track = this.view.track.element.getBoundingClientRect();
    const trackWidth = isVertical ? track.height : track.width;
    const thumbWidth = this.view.firstThumb.element.getBoundingClientRect().width;

    const trackWidthWithoutThumb = trackWidth - thumbWidth;
    return trackWidthWithoutThumb;
  }

  getPXPerMark() {
    const min = this.model.getMin();
    const max = this.model.getMax();
    const step = this.model.getStep();

    const trackWidthWithoutThumb = this.getTrackWidthWithoutThumb();

    const markCount = (max - min) / step;
    const PXperMark = trackWidthWithoutThumb / markCount;

    return PXperMark;
  }

  getCurrentMark(offsetX: number) {
    const PXperMark = this.getPXPerMark();
    const currentMark = Math.floor(offsetX / PXperMark);

    return currentMark;
  }

  getShiftInPX(offsetX: number) {
    const PXperMark = this.getPXPerMark();
    const currentMark = this.getCurrentMark(offsetX);
    const trackWidthWithoutThumb = this.getTrackWidthWithoutThumb();

    let shiftInPX = currentMark * PXperMark;

    if (shiftInPX > trackWidthWithoutThumb) shiftInPX = trackWidthWithoutThumb;
    if (shiftInPX < 0) shiftInPX = 0;

    return shiftInPX;
  }

  getThumbValue(offsetX: number) {
    const min = this.model.getMin();
    const max = this.model.getMax();
    const step = this.model.getStep();

    const currentMark = this.getCurrentMark(offsetX);
    let thumbValue = currentMark * step + min;

    if (thumbValue < min) thumbValue = min;
    if (thumbValue > max) thumbValue = max;

    return thumbValue;
  }

  getCoordinatesByValue(value: number) {
    const min = this.model.getMin();
    const PXPerValue = this.getPXPerMark() / this.model.getStep();
    const coordinates = PXPerValue * value;
    const negativeOffset = PXPerValue * Math.abs(min);

    return min > 0 ? coordinates - negativeOffset : coordinates + negativeOffset;
  }

  changeFrom(value: number, offsetX?: number) {
    if (!offsetX) offsetX = this.getCoordinatesByValue(value);

    const shiftInPX = this.getShiftInPX(offsetX);
    const thumbValue = this.getThumbValue(offsetX);
    const to = this.model.getTo();
    const isRange = this.model.getIsRange();
    const isVertical = this.model.getIsVertical();

    if (isRange && thumbValue >= to) return;

    this.view.firstThumb.move(shiftInPX);
    this.model.setFrom(thumbValue);
    this.view.firstThumb.tip.setValue(thumbValue);

    if (isRange) {
      this.view.bar.updateRange(
        this.view.firstThumb.element.offsetLeft,
        this.view.secondThumb.element.offsetLeft,
      );
    } else {
      this.view.bar.update(this.view.firstThumb.element.offsetLeft);
    }
  }

  changeTo(value: number, offsetX?: number) {
    const isRange = this.model.getIsRange();

    if (!isRange) return;
    if (!offsetX) offsetX = this.getCoordinatesByValue(value);

    const shiftInPX = this.getShiftInPX(offsetX);
    const thumbValue = this.getThumbValue(offsetX);
    const from = this.model.getFrom();
    const isVertical = this.model.getIsVertical();

    if (thumbValue <= from) return;

    this.view.secondThumb.move(shiftInPX);
    this.model.setTo(thumbValue);
    this.view.secondThumb.tip.setValue(thumbValue);

    this.view.bar.updateRange(
      this.view.firstThumb.element.offsetLeft,
      this.view.secondThumb.element.offsetLeft,
    );
  }

  showScale(show: boolean) {
    this.model.setShowScale(show);
    this.render();
  }

  showTip(show: boolean) {
    this.model.setShowTip(show);
    this.render();
  }

  showBar(show: boolean) {
    this.model.setShowBar(show);
    this.render();
  }

  setRange(isRange: boolean) {
    this.model.setIsRange(isRange);
    this.render();
  }

  setVertical(isVertical: boolean) {
    this.model.setIsVertical(isVertical);
    this.render();
  }

  changeMin(min: number) {
    this.model.setMin(min);
    this.render();
  }

  changeMax(max: number) {
    this.model.setMax(max);
    this.render();
  }

  changeStep(step: number) {
    this.model.setStep(step);
    this.render();
  }
}

export default Presenter;
