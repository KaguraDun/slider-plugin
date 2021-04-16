import Thumb from './Thumb';
import Track from './Track';
import Tip from './Tip';
import Scale from './Scale';
import Bar from './Bar';

class View {
  track: Track;
  parent: HTMLElement;
  firstThumb: Thumb;
  secondThumb: Thumb;
  tip: Tip;
  scale: Scale;
  bar: Bar;

  constructor() {
    this.parent;
    this.track = new Track();
    this.firstThumb = new Thumb();
    this.secondThumb = new Thumb();
    this.tip = new Tip();
    this.scale = new Scale();
    this.bar = new Bar();
  }

  clearAll() {
    this.parent.innerHTML = '';
  }

  renderTrack() {
    this.track.render(this.parent);
  }

  renderBar(){
    this.bar.render(this.track.element);
  }

  renderThumb(handler: any) {
    this.firstThumb.render(this.track.element, handler);
  }

  renderRange(handler: any) {
    this.firstThumb.render(this.track.element, handler);
    this.secondThumb.render(this.track.element, handler);
  }

  renderScale(params: any) {
    this.scale.render(this.parent, params);
  }

}

export default View;
