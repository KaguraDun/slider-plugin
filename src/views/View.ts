import Thumb from './Thumb';
import Track from './Track';

class View {
  track: HTMLElement;
  parent: HTMLElement;
  thumb: Thumb;

  constructor() {
    this.parent = document.querySelector('.container');
    this.track;
    this.thumb = new Thumb();
  }

  renderTrack() {
    this.track = new Track(this.parent).render();
  }

  renderThumb(from: number, handler: Function) {
    this.thumb.render(this.track, from, handler);
  }
}

export default View;
