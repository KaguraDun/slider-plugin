import Thumb from './Thumb';
import Track from './Track';
import Tip from './Tip';

class View {
  track: Track;
  parent: HTMLElement;
  thumb: Thumb;
  tip: Tip;

  constructor() {
    this.parent = document.querySelector('.container');
    this.track = new Track();
    this.thumb = new Thumb();
    this.tip = new Tip();
  }

  renderTrack() {
    this.track.render(this.parent);
  }

  renderThumb(from: number, handler: Function) {
    this.thumb.render(this.track.element, from, handler);
  }

  renderTip(from: number){
    this.tip.render(this.thumb.element, from);
  }
}

export default View;
