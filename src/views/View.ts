import createElement from '@/helpers/createElement';
import SliderSettings from '@/models/SliderSetting';
import ThumbID from '@/models/ThumbID';
import { ObserverEvents } from '@/observer/ObserverEvents';
import Tip from '@/views/Tip';

import Bar from './Bar';
import Scale from './Scale';
import Thumb from './Thumb';
import Track from './Track';

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

  toggleSliderVertical(isVertical: boolean) {
    this.slider.classList.toggle('slider--vertical', isVertical);
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
    this.toggleSliderVertical(isVertical);

    this.container = container;
    this.container.append(this.slider);
    this.track.render(this.slider);

    this.firstThumb.render(this.track.element, state);
    this.firstThumb.renderTip(values[fromIndex], showTip);

    this.secondThumb.render(this.track.element, state);
    this.secondThumb.renderTip(values[toIndex], showTip);

    this.scale.render(this.slider, state, this.firstThumb.getPXPerMark());

    this.bar.show(showBar);
    this.bar.update({
      firstThumb: this.firstThumb.element,
      secondThumb: this.secondThumb.element,
      isRange,
      isVertical,
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

    this.toggleSliderVertical(isVertical);

    this.firstThumb.move(fromIndex, isVertical);
    this.firstThumb.tip.show(showTip);

    this.secondThumb.show(isRange);
    this.secondThumb.move(toIndex, isVertical);
    this.secondThumb.tip.show(showTip);

    this.updateTips({
      fromValue: values[fromIndex],
      toValue: values[toIndex],
      isRange,
      isVertical,
    });

    this.scale.show(showScale);
    this.scale.render(this.slider, state, this.firstThumb.getPXPerMark());

    this.bar.show(showBar);
    this.bar.update({
      firstThumb: this.firstThumb.element,
      secondThumb: this.secondThumb.element,
      isRange,
      isVertical,
    });
  }

  private updateTips({
    fromValue,
    toValue,
    isRange,
    isVertical,
  }: SliderSettings) {
    const isIntersect = Tip.checkIntersection({
      firstTip: this.firstThumb.tip.element,
      secondTip: this.secondThumb.tip.element,
      isVertical,
    });

    const toggle = isRange ? isIntersect : false;
    this.firstThumb.tip.toggleExpand(toggle);

    if (isIntersect && isRange) {
      const tipValue = isVertical
        ? `${fromValue} ${toValue}`
        : `${fromValue} : ${toValue}`;

      this.secondThumb.tip.show(false);
      this.firstThumb.tip.update(tipValue);
    } else {
      this.firstThumb.tip.update(fromValue);
      this.secondThumb.tip.update(toValue);
    }
  }
}

export default View;
