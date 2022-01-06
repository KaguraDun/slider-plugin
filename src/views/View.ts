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
  private prevState: SliderState | undefined;

  constructor(observerEvents: ObserverEvents) {
    this.observerEvents = observerEvents;
    this.container = null;
    this.slider = createElement('div', { class: 'slider' });
    this.track = new Track();
    this.firstThumb = new Thumb(ThumbID.from, this.observerEvents);
    this.secondThumb = new Thumb(ThumbID.to, this.observerEvents);
    this.scale = new Scale(this.observerEvents);
    this.bar = new Bar(this.track.element);
    this.prevState = undefined;
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
    const fromValue = values[fromIndex];
    const toValue = toIndex !== undefined ? values[toIndex] : undefined;

    this.toggleSliderVertical(isVertical);

    this.container = container;
    this.container.append(this.slider);
    this.track.render(this.slider);

    this.firstThumb.render(this.track.element, state);
    this.firstThumb.renderTip(fromValue, showTip);
    this.firstThumb.toggleTopElement(true);

    this.secondThumb.render(this.track.element, state);
    if (toValue !== undefined) this.secondThumb.renderTip(toValue, showTip);

    this.updateTips({
      fromValue,
      toValue,
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

    if (this.stateParamsChanged({ isVertical })) {
      this.toggleSliderVertical(isVertical);
    }

    if (this.stateParamsChanged({ fromIndex, isVertical })) {
      this.firstThumb.move(fromIndex, isVertical);
    }

    if (this.stateParamsChanged({ isRange })) {
      this.secondThumb.show(isRange);
    }

    if (
      toIndex !== undefined &&
      this.stateParamsChanged({ toIndex, isVertical })
    ) {
      this.secondThumb.move(toIndex, isVertical);
    }

    const fromValue = values[fromIndex];
    const toValue = toIndex !== undefined ? values[toIndex] : undefined;

    if (
      this.stateParamsChanged({
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

    if (this.stateParamsChanged({ showScale })) {
      this.scale.show(showScale);
    }

    if (this.stateParamsChanged({ min, max, step, isVertical })) {
      this.scale.render({
        sliderElement: this.slider,
        state,
        percentPerMark: this.firstThumb.getPercentPerMark(),
        thumbRect: this.firstThumb.element.getBoundingClientRect(),
      });
    }

    if (this.stateParamsChanged({ showBar })) {
      this.bar.show(showBar);
    }

    if (this.stateParamsChanged({ fromIndex, toIndex, isRange, isVertical })) {
      this.bar.update({
        firstThumb: this.firstThumb.element,
        secondThumb: this.secondThumb.element,
        isRange,
        isVertical,
      });
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

    if (isIntersect && isRange) {
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

  private stateParamsChanged(params: Partial<SliderState>) {
    if (!this.prevState) return;
    let isChanged = false;

    Object.entries(params).forEach(([name, value]) => {
      if (this.prevState?.[name as keyof SliderState] !== value) {
        isChanged = true;
      }
    });

    return isChanged;
  }
}

export default View;
