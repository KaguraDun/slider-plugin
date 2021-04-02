class Presenter {
  view: any;
  model: any;

  constructor(model: any, view: any) {
    this.model = model;
    this.view = view;
  }

  init() {
    //Вот тут нужно понять использовать ли гет в модели или напрямую считывать из свойств;
    const { min, max, step } = this.model;

    this.view.renderTrack();
    this.view.renderThumb(this.model.getFrom(), this.handleDragThumb);
    this.view.renderTip(this.model.getFrom());
    this.view.renderScale({ min, max, step });
  }

  handleDragThumb = (e: MouseEvent) => {
    e.preventDefault();

    let shiftX = e.clientX - this.view.thumb.element.offsetLeft;

    const onMouseMove = (e: MouseEvent) => {
      let offsetX = e.clientX - shiftX - this.view.track.element.offsetLeft;

      const trackWidth = this.view.track.element.getBoundingClientRect().width;
      const thumbWidth = this.view.thumb.element.getBoundingClientRect().width;

      const shiftStep = trackWidth / this.model.getStep();
      const thumbOffset = trackWidth - thumbWidth;

      let offsetStep = Math.ceil((offsetX * this.model.getStep()) / trackWidth);
      let finalShift = offsetStep * shiftStep;

      offsetStep *= this.model.getStep();

      if (finalShift >= thumbOffset) {
        finalShift = thumbOffset;
        offsetStep = this.model.getMax();
      }

      if (finalShift <= 0) {
        finalShift = 0;
        offsetStep = this.model.getMin();
      }

      this.model.setFrom(offsetStep);
      this.view.thumb.move(finalShift);
      this.view.tip.setValue(offsetStep);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
}

export default Presenter;
