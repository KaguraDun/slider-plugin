class Presenter {
  model: any;
  view: any;

  constructor(model: any, view: any) {
    this.model = model;
    this.view = view;
  }

  render() {
    const min = this.model.getMin();
    const max = this.model.getMax();
    const step = this.model.getStep();

    this.view.clearAll();
    this.view.renderTrack();
    this.view.renderThumb(this.model.getFrom(), this.handleDragThumb);
    this.view.renderTip(this.model.getMin());
    this.view.renderScale({ min, max, step });
  }

  handleDragThumb = (e: MouseEvent) => {
    e.preventDefault();

    const shiftX = e.clientX - this.view.thumb.element.offsetLeft;

    const onMouseMove = (e: MouseEvent) => {
      const offsetX = e.clientX - shiftX - this.view.track.element.offsetLeft;

      const min = this.model.getMin();
      const max = this.model.getMax();
      const step = this.model.getStep();

      const trackWidth = this.view.track.element.getBoundingClientRect().width;
      const thumbWidth = this.view.thumb.element.getBoundingClientRect().width;

      let trackWidthWithoutThumb = trackWidth - thumbWidth;
      let markCount = (max - min) / step;

      const PXperMark = trackWidthWithoutThumb / markCount;
      const currentMark = Math.floor(offsetX / PXperMark);

      const shiftInPX = currentMark * PXperMark;
      const fromValue = currentMark * step + min;

      const isRightBorder = shiftInPX > trackWidthWithoutThumb;
      const isLeftBorder = shiftInPX < 0;

      if (isLeftBorder || isRightBorder) return;

      this.model.setFrom(fromValue);
      this.view.thumb.move(shiftInPX);
      this.view.tip.setValue(fromValue);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

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
}

export default Presenter;
