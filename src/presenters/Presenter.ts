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
    const showScale = this.model.getShowScale();
    const showTip = this.model.getShowTip();

    this.view.clearAll();
    this.view.renderTrack();
    this.view.renderThumb(this.handleDragThumb);

    if (showTip) this.view.renderTip(min);
    if (showScale) this.view.renderScale({ min, max, step });

    const fromCoords = this.getFromCoordinates(from);
    this.moveThumb(fromCoords);
  }

  getFromCoordinates(from: any) {
    const min = this.model.getMin();
    const max = this.model.getMax();
    const step = this.model.getStep();

    const PXperMark = this.getPXPerMark({ min, max, step });
    const PXperValue = PXperMark / step;

    return PXperValue * from;
  }

  handleDragThumb = (e: MouseEvent) => {
    e.preventDefault();

    const shiftX = e.clientX - this.view.thumb.element.offsetLeft;

    const onMouseMove = (e: MouseEvent) => {
      const offsetX = e.clientX - shiftX - this.view.track.element.offsetLeft;

      this.moveThumb(offsetX);
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
    const thumbWidth = this.view.thumb.element.getBoundingClientRect().width;

    const trackWidthWithoutThumb = trackWidth - thumbWidth;
    return trackWidthWithoutThumb;
  }

  getPXPerMark({ min, max, step }: any) {
    const trackWidthWithoutThumb = this.getTrackWidthWithoutThumb();

    const markCount = (max - min) / step;
    const PXperMark = trackWidthWithoutThumb / markCount;
    return PXperMark;
  }

  moveThumb(offsetX: number) {
    const min = this.model.getMin();
    const max = this.model.getMax();
    const step = this.model.getStep();

    const trackWidthWithoutThumb = this.getTrackWidthWithoutThumb();

    const PXperMark = this.getPXPerMark({ min, max, step });
    const currentMark = Math.floor(offsetX / PXperMark);

    const shiftInPX = currentMark * PXperMark;
    const fromValue = currentMark * step + min;

    const isRightBorder = shiftInPX > trackWidthWithoutThumb;
    const isLeftBorder = shiftInPX < 0;

    if (isLeftBorder || isRightBorder) return;

    this.model.setFrom(fromValue);
    this.view.thumb.move(shiftInPX);
    this.view.tip.setValue(fromValue);
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

  changeFrom(value: number) {
    const offsetX = this.getFromCoordinates(value);
    this.moveThumb(offsetX);
  }

  showScale(show: boolean) {
    this.model.setShowScale(show);
    this.render();
  }

  showTip(show: boolean) {
    this.model.setShowTip(show);
    this.render();
  }
}

export default Presenter;
