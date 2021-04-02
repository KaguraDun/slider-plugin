import Thumb from './Thumb';
import Track from './Track';

class View {
  track: Track;
  parent: HTMLElement;
  thumb: Thumb;

  constructor() {
    this.parent = document.querySelector('.container');
    this.track = new Track();
    this.thumb = new Thumb();
  }

  renderTrack() {
    this.track.render(this.parent);
  }

  renderThumb(from: number, handler: Function) {
    this.thumb.render(this.track.element, from, handler);
  }
}

export default View;
