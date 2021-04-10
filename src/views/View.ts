import Thumb from './Thumb';
import Track from './Track';
import Tip from './Tip';
import Scale from './Scale';

class View {
  track: Track;
  parent: HTMLElement;
  thumb: Thumb;
  tip: Tip;
  scale: Scale;

  constructor() {
    this.parent;
    this.track = new Track();
    this.thumb = new Thumb();
    this.tip = new Tip();
    this.scale = new Scale();
  }

  clearAll() {
    this.parent.innerHTML = '';
  }

  renderTrack() {
    this.track.render(this.parent);
  }

  renderThumb(handler: any) {
    this.thumb.render(this.track.element, handler);
  }

  renderTip(from: number) {
    this.tip.render(this.thumb.element, from);
  }

  renderScale(params: any) {
    this.scale.render(this.parent, params);
  }
}

export default View;
