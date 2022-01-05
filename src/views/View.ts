import createElement from '@/helpers/createElement';
import SliderSettings from '@/models/SliderSetting';
import SliderState from '@/models/SliderState';
import ThumbID from '@/models/ThumbID';
import { ObserverEvents } from '@/observer/ObserverEvents';
import Tip from '@/views/Tip';

import Bar from './Bar';
import Scale from './Scale';
import Thumb from './Thumb';
import Track from './Track';

interface UpdateTipsProps {
  fromValue: number;
  toValue: number | undefined;
  isRange: boolean;
  isVertical: boolean;
}

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
    this.firstThumb = new Thumb(ThumbID.from, this.observerEvents);
    this.secondThumb = new Thumb(ThumbID.to, this.observerEvents);
    this.scale = new Scale(this.observerEvents);
    this.bar = new Bar(this.track.element);
  }

  toggleSliderVertical(isVertical: boolean) {
    this.slider.classList.toggle('slider_vertical', isVertical);
  }

  init(container: HTMLElement, state: SliderState) {
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
    this.firstThumb.toggleTopElement(true);

    this.secondThumb.render(this.track.element, state);
    if (toIndex) this.secondThumb.renderTip(values[toIndex], showTip);

    const toValue = toIndex ? values[toIndex] : undefined;
    this.updateTips({
      fromValue: values[fromIndex],
      toValue: toValue,
      isRange,
      isVertical,
    });

    this.scale.render({
      sliderElement: this.slider,
      state,
      percentPerMark: this.firstThumb.getPercentPerMark(),
      thumbRect: this.firstThumb.element.getBoundingClientRect(),
    });

    this.bar.show(showBar);
    this.bar.update({
      firstThumb: this.firstThumb.element,
      secondThumb: this.secondThumb.element,
      isRange,
      isVertical,
    });
  }

  update = (state: SliderState) => {
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
    if (toIndex) this.secondThumb.move(toIndex, isVertical);
    this.secondThumb.tip.show(showTip);

    const toValue = toIndex ? values[toIndex] : undefined;
    this.updateTips({
      fromValue: values[fromIndex],
      toValue,
      isRange,
      isVertical,
    });

    this.scale.show(showScale);
    this.scale.render({
      sliderElement: this.slider,
      state,
      percentPerMark: this.firstThumb.getPercentPerMark(),
      thumbRect: this.firstThumb.element.getBoundingClientRect(),
    });

    this.bar.show(showBar);
    this.bar.update({
      firstThumb: this.firstThumb.element,
      secondThumb: this.secondThumb.element,
      isRange,
      isVertical,
    });
  };

  setTopThumb = (thumbState: Partial<Pick<SliderSettings, 'from' | 'to'>>) => {
    const [thumbID] = Object.keys(thumbState);

    if (thumbID === ThumbID.from) {
      this.firstThumb.toggleTopElement(true);
      this.secondThumb.toggleTopElement(false);
    }

    if (thumbID === ThumbID.to) {
      this.firstThumb.toggleTopElement(false);
      this.secondThumb.toggleTopElement(true);
    }
  };

  private updateTips({
    fromValue,
    toValue,
    isRange,
    isVertical,
  }: UpdateTipsProps) {
    const isIntersect = Tip.checkIntersection({
      firstTip: this.firstThumb.tip.element,
      secondTip: this.secondThumb.tip.element,
      isVertical,
    });

    const toggle = isRange ? isIntersect : false;
    this.firstThumb.tip.toggleExpand(toggle);

    if (isIntersect && isRange && toValue) {
      const tipValue = isVertical
        ? `${fromValue} ${toValue}`
        : `${fromValue} : ${toValue}`;

      this.secondThumb.tip.show(false);
      this.firstThumb.tip.update(tipValue);
    } else {
      this.firstThumb.tip.update(String(fromValue));
      if (toValue) this.secondThumb.tip.update(String(toValue));
    }
  }
}

export default View;
