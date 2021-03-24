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
    console.log(e);
    console.log(this.view);
    let shiftX = e.clientX - this.view.thumb.element.getBoundingClientRect().left;

    this.view.thumb.element.addEventListener('mousemove', (e) => {
      let offsetX = e.pageX - shiftX - this.view.track.getBoundingClientRect().left;
      this.model.setFrom(offsetX);
      this.view.thumb.move(offsetX);
    });
  };
}

export default Presenter;
