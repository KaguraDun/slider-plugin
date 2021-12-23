import Thumb from './Thumb';
import Track from './Track';
import Scale from './Scale';
import Bar from './Bar';
import createElement from '@/helpers/createElement';
import SliderSettings from '@/models/SliderSetting';
import { ObserverEvents } from '@/observer/ObserverEvents';
import ThumbID from '@/models/ThumbID';
class View {
  private observerEvents: ObserverEvents;
  private track: Track;
  private container: HTMLElement | null;
  private slider: HTMLElement;
  private firstThumb: Thumb;
  private secondThumb: Thumb;
  private scale: Scale;
  private bar: Bar;

  constructor(observerEvents: ObserverEvents) {
    this.observerEvents = observerEvents;
    this.container = null;
    this.slider = createElement('div', { class: 'slider' });
    this.track = new Track();
    this.firstThumb = new Thumb(ThumbID.from, this.observerEvents.thumbMoved);
    this.secondThumb = new Thumb(ThumbID.to, this.observerEvents.thumbMoved);
    this.scale = new Scale(this.observerEvents.scaleClick);
    this.bar = new Bar(this.track.element);
    this.update = this.update.bind(this);
  }

  init(container: HTMLElement, state: SliderSettings) {
    const {
      fromIndex,
      toIndex,
      values,
      showTip,
      showBar,
      isRange,
      isVertical,
    } = state;

    this.container = container;
    this.container.append(this.slider);
    this.track.render(this.slider, isRange);

    this.firstThumb.render(this.track.element, state);
    this.firstThumb.renderTip(values[fromIndex], isVertical, showTip);
    this.secondThumb.render(this.track.element, state);
    this.secondThumb.renderTip(values[toIndex], isVertical, showTip);

    this.scale.render(this.slider, state, this.firstThumb.getPXPerMark());

    this.bar.show(showBar);
    this.bar.update({
      firstThumbOffset: this.firstThumb.element.offsetLeft,
      secondThumbOffset: this.secondThumb.element.offsetLeft,
      isRange,
    });
  }

  update(state: SliderSettings) {
    const {
      fromIndex,
      toIndex,
      values,
      showScale,
      showTip,
      showBar,
      isRange,
      isVertical,
    } = state;

    this.firstThumb.move(fromIndex);
    this.firstThumb.tip.update(values[fromIndex]);
    this.firstThumb.tip.show(showTip);

    this.secondThumb.show(isRange);
    this.secondThumb.move(toIndex);
    this.secondThumb.tip.update(values[toIndex]);
    this.secondThumb.tip.show(showTip);

    this.scale.show(showScale);

    this.scale.render(this.slider, state, this.firstThumb.getPXPerMark());

    this.bar.show(showBar);
    this.bar.update({
      firstThumbOffset: this.firstThumb.element.offsetLeft,
      secondThumbOffset: this.secondThumb.element.offsetLeft,
      isRange,
    });
  }
}

export default View;
