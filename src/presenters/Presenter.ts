class Presenter {
  view: any;
  model: any;

  constructor(model: any, view: any) {
    this.model = model;
    this.view = view;
  }

  init() {
    this.view.renderTrack();
    this.view.renderThumb(this.model.getFrom(), this.handleDragThumb);
  }

  handleDragThumb = (e: MouseEvent) => {
    e.preventDefault();

    let shiftX = e.clientX - this.view.thumb.element.offsetLeft;

    const onMouseMove = (e: MouseEvent) => {
      let offsetX = e.clientX - shiftX - this.view.track.element.offsetLeft;

      const trackWidth = this.view.track.element.getBoundingClientRect().width;
      const thumbWidth = this.view.thumb.element.getBoundingClientRect().width;

      if (offsetX < 0) {
        offsetX = 0;
      }

      const thumbOffset = trackWidth - thumbWidth;

      if (offsetX > thumbOffset) {
        offsetX = thumbOffset;
      }

      this.model.setFrom(offsetX);
      this.view.thumb.move(offsetX);
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
