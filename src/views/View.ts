import SliderSettings from '@/models/SliderSetting';
import SliderState from '@/models/SliderState';
import ThumbID from '@/models/ThumbID';
import Tip from '@/views/Tip';
import { ObserverEvents } from '@/observer/ObserverEvents';

import Bar from './Bar';
import Scale from './Scale';
import Slider from './Slider';
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
  private slider: Slider;
  private firstThumb: Thumb;
  private secondThumb: Thumb;
  private scale: Scale;
  private bar: Bar;
  private prevState: SliderState | undefined;

  constructor(observerEvents: ObserverEvents) {
    this.observerEvents = observerEvents;
    this.container = null;
    this.slider = new Slider();
    this.track = new Track();
    this.firstThumb = new Thumb(ThumbID.from, this.observerEvents);
    this.secondThumb = new Thumb(ThumbID.to, this.observerEvents);
    this.scale = new Scale(this.observerEvents);
    this.bar = new Bar(this.track.element);
    this.prevState = undefined;
  }

  init(container: HTMLElement, state: SliderState) {
    const { fromIndex, toIndex, values, showTip } = state;
    const fromValue = values[fromIndex];
    const toValue = toIndex !== undefined ? values[toIndex] : undefined;

    this.container = container;
    this.slider.render(this.container);
    this.track.render(this.slider.element);

    this.firstThumb.render(this.track.element, state);
    this.firstThumb.renderTip(fromValue, showTip);
    this.firstThumb.toggleTopElement(true);

    this.secondThumb.render(this.track.element, state);
    if (toValue !== undefined) this.secondThumb.renderTip(toValue, showTip);

    this.update(state);
    this.prevState = { ...state };
  }

  update = (state: SliderState) => {
    const {
      min,
      max,
      step,
      fromIndex,
      toIndex,
      values,
      showScale,
      showTip,
      showBar,
      isRange,
      isVertical,
    } = state;

    if (this.hasStateChanged({ isVertical })) {
      this.slider.toggleVertical(isVertical);
    }

    if (this.hasStateChanged({ fromIndex, isVertical })) {
      this.firstThumb.move(fromIndex, isVertical);
    }

    if (this.hasStateChanged({ isRange })) {
      this.secondThumb.show(isRange);
    }

    const isToIndex = toIndex !== undefined;

    if (isToIndex && this.hasStateChanged({ toIndex, isVertical })) {
      this.secondThumb.move(toIndex, isVertical);
    }

    const fromValue = values[fromIndex];
    const toValue = isToIndex ? values[toIndex] : undefined;

    if (
      this.hasStateChanged({
        fromIndex,
        toIndex,
        isRange,
        isVertical,
        showTip,
      })
    ) {
      this.firstThumb.tip.show(showTip);
      this.secondThumb.tip.show(showTip);

      this.updateTips({
        fromValue,
        toValue,
        isRange,
        isVertical,
      });
    }

    if (this.hasStateChanged({ showScale })) {
      this.scale.show(showScale);
    }

    if (this.hasStateChanged({ min, max, step, isVertical, values })) {
      this.scale.render({
        sliderElement: this.slider.element,
        state: { ...state },
        percentPerMark: this.firstThumb.getPercentPerMark(),
        thumbRect: this.firstThumb.element.getBoundingClientRect(),
      });
    }

    if (this.hasStateChanged({ showBar })) {
      this.bar.show(showBar);
    }

    if (this.hasStateChanged({ fromIndex, toIndex, isRange, isVertical })) {
      this.bar.update({ ...this.getThumbParams(), isRange, isVertical });
    }

    this.prevState = { ...state };
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

    const shouldUpdateExpandedTip = isIntersect && isRange;
    if (shouldUpdateExpandedTip) {
      const tipValue = isVertical
        ? `${fromValue} ${toValue}`
        : `${fromValue} : ${toValue}`;

      this.secondThumb.tip.show(false);
      this.firstThumb.tip.update(tipValue);
    } else {
      this.firstThumb.tip.update(String(fromValue));
      this.secondThumb.tip.update(String(toValue));
    }
  }

  private hasStateChanged(stateValues: Partial<SliderState>) {
    if (!this.prevState) return true;
    let isChanged = false;

    Object.entries(stateValues).forEach(([name, value]) => {
      if (this.prevState?.[name as keyof SliderState] !== value) {
        isChanged = true;
      }
    });

    return isChanged;
  }

  private getThumbParams() {
    return {
      firstThumbOffset: {
        offsetLeft: this.firstThumb.element.offsetLeft,
        offsetTop: this.firstThumb.element.offsetTop,
      },
      secondThumbOffset: {
        offsetLeft: this.secondThumb.element.offsetLeft,
        offsetTop: this.secondThumb.element.offsetTop,
      },
      thumbSize: {
        width: this.firstThumb.element.getBoundingClientRect().width,
        height: this.firstThumb.element.getBoundingClientRect().height,
      },
    };
  }
}

export default View;
