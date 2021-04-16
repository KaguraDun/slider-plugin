import Model from '../models/Model';
import View from '../views/View';

class Presenter {
  model: any;
  view: View;

  constructor() {
    this.model = new Model();
    this.view = new View();
  }

  createSlider(parent: HTMLElement, params?: any) {
    this.view.parent = parent;
    this.render();
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

    this.view.clearAll();
    this.view.renderTrack();
    if (showBar) this.view.renderBar();

    if (isRange) {
      this.view.renderRange(this.handleDragThumb);
    } else {
      this.view.renderThumb(this.handleDragThumb);
    }

    if (showTip) {
      this.view.firstThumb.renderTip(from);
      if (isRange) this.view.secondThumb.renderTip(to);
    }

    if (showScale) this.view.renderScale({ min, max, step });

    this.changeFrom(from);
    if (isRange) this.changeTo(to);
  }

  getCoordinatesByValue(value: number) {
    const min = this.model.getMin();
    const max = this.model.getMax();
    const step = this.model.getStep();

    const PXperMark = this.getPXPerMark({ min, max, step });
    const PXperValue = PXperMark / step;

    return PXperValue * value;
  }

  handleDragThumb = (e: MouseEvent, selectedThumb: any) => {
    e.preventDefault();

    const shiftX = e.clientX - this.view.firstThumb.element.offsetLeft;

    const onMouseMove = (e: MouseEvent) => {
      const offsetX = e.clientX - shiftX;
      const isFirstThumb = selectedThumb === this.view.firstThumb;

      if (isFirstThumb) {
        this.changeFrom(0, offsetX);
      } else {
        this.changeTo(0, offsetX);
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
    const trackWidth = this.view.track.element.getBoundingClientRect().width;
    const thumbWidth = this.view.firstThumb.element.getBoundingClientRect().width;

    const trackWidthWithoutThumb = trackWidth - thumbWidth;
    return trackWidthWithoutThumb;
  }

  getPXPerMark({ min, max, step }: any) {
    const trackWidthWithoutThumb = this.getTrackWidthWithoutThumb();

    const markCount = (max - min) / step;
    const PXperMark = trackWidthWithoutThumb / markCount;
    return PXperMark;
  }

  calculateThumbProperties(offsetX: number) {
    const min = this.model.getMin();
    const max = this.model.getMax();
    const step = this.model.getStep();

    const PXperMark = this.getPXPerMark({ min, max, step });
    const currentMark = Math.floor(offsetX / PXperMark);

    let shiftInPX = currentMark * PXperMark;
    let thumbValue = currentMark * step + min;
    const trackWidthWithoutThumb = this.getTrackWidthWithoutThumb();

    if (thumbValue < min) thumbValue = min;
    if (thumbValue > max) thumbValue = max;

    if (shiftInPX > trackWidthWithoutThumb) shiftInPX = trackWidthWithoutThumb;
    if (shiftInPX < 0) shiftInPX = 0;
    return { shiftInPX, thumbValue };
  }

  moveThumb(thumb: any, shiftInPX: number) {
    thumb.move(shiftInPX);
  }

  changeMin(value: number) {
    this.model.setMin(value);
    this.render();
  }

  changeMax(value: number) {
    this.model.setMax(value);
    this.render();
  }

  changeStep(value: number) {
    this.model.setStep(value);
    this.render();
  }

  changeFrom(value: number, offsetX?: number) {
    if (!offsetX) offsetX = this.getCoordinatesByValue(value);

    const { thumbValue, shiftInPX } = this.calculateThumbProperties(offsetX);
    const to = this.model.getTo();
    const isRange = this.model.getIsRange();

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

    const { thumbValue, shiftInPX } = this.calculateThumbProperties(offsetX);
    const from = this.model.getFrom();

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

  isRange(isRange: boolean) {
    this.model.setIsRange(isRange);
    this.render();
  }
}

export default Presenter;
