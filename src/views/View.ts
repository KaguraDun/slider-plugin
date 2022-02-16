import SliderSettings from '@/models/SliderSetting';
import SliderState from '@/models/SliderState';
import ThumbID from '@/models/ThumbID';
import Tip from '@/views/Tip';
import { ObserverEvents } from '@/observer/ObserverEvents';
import { getSizeLiteral } from '@/helpers/getLiteral';
import getPercentOfNumber from '@/helpers/getPercentOfNumber';

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
  private container: HTMLElement | null;
  private slider: Slider;
  private track: Track;
  private firstThumb: Thumb;
  private secondThumb: Thumb;
  private scale: Scale;
  private bar: Bar;
  private prevState: SliderState | undefined;

  constructor(observerEvents: ObserverEvents) {
    this.observerEvents = observerEvents;
    this.container = null;
    this.slider = new Slider();
    this.track = new Track(this.observerEvents);
    this.firstThumb = new Thumb({
      parent: this.track.element,
      thumbID: ThumbID.from,
      observerEvents: this.observerEvents,
    });
    this.secondThumb = new Thumb({
      parent: this.track.element,
      thumbID: ThumbID.to,
      observerEvents: this.observerEvents,
    });
    this.scale = new Scale(this.slider.element, this.observerEvents);
    this.bar = new Bar(this.track.element);
    this.prevState = undefined;
  }

  init(container: HTMLElement, state: Readonly<SliderState>) {
    const { fromIndex, toIndex, values, showTip } = state;
    const fromValue = values[fromIndex];
    const toValue = toIndex !== undefined ? values[toIndex] : undefined;

    this.container = container;
    this.slider.render(this.container);
    this.track.render(this.slider.element);

    this.firstThumb.render(state);
    this.firstThumb.renderTip(fromValue, showTip);
    this.firstThumb.toggleTopElement(true);

    this.secondThumb.render(state);
    if (toValue !== undefined) this.secondThumb.renderTip(toValue, showTip);

    this.update(state);
  }

  update = (state: Readonly<SliderState>) => {
    const {
      min,
      max,
      step,
      fromIndex,
      toIndex,
      maxIndex,
      values,
      showScale,
      showTip,
      showBar,
      isRange,
      isVertical,
    } = state;

    if (this.hasStateChanged({ maxIndex, isVertical })) {
      this.track.setClickEventArguments({
        maxIndex,
        isVertical,
      });
    }
    if (this.hasStateChanged({ isVertical })) {
      this.slider.toggleVertical(isVertical);
    }

    if (this.hasStateChanged({ fromIndex, isVertical, min, max, step })) {
      this.firstThumb.move({
        valueIndex: fromIndex,
        isVertical,
        maxIndex,
        values,
      });
    }

    if (this.hasStateChanged({ isRange })) {
      this.secondThumb.show(isRange);
    }

    const isToIndex = toIndex !== undefined;
    const shouldUpdateSecondTip =
      isToIndex &&
      this.hasStateChanged({ toIndex, isVertical, min, max, step });

    if (shouldUpdateSecondTip) {
      this.secondThumb.move({
        valueIndex: toIndex,
        isVertical,
        maxIndex,
        values,
      });
    }

    const fromValue = values[fromIndex];
    const toValue = isToIndex ? values[toIndex] : undefined;

    if (
      this.hasStateChanged({
        fromIndex,
        toIndex,
        isRange,
        isVertical,
        step,
        showTip,
        min,
        max,
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

    if (
      this.hasStateChanged({
        min,
        max,
        step,
        isVertical,
        values,
        fromIndex,
        toIndex,
      })
    ) {
      this.scale.render({
        state,
        percentPerMark: this.firstThumb.getPercentPerMark({
          isVertical,
          maxIndex,
        }),
        thumbRect: this.firstThumb.element.getBoundingClientRect(),
      });
    }

    if (this.hasStateChanged({ showBar })) {
      this.bar.show(showBar);
    }

    if (
      this.hasStateChanged({
        fromIndex,
        toIndex,
        isRange,
        isVertical,
        min,
        max,
        step,
      })
    ) {
      this.updateBar(isVertical, isRange);
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

  private updateBar(isVertical: boolean, isRange: boolean) {
    const firstThumbOffsetPercent =
      this.firstThumb.getOffsetPercent(isVertical);

    const secondThumbOffsetPercent =
      this.secondThumb.getOffsetPercent(isVertical);

    const distanceBetweenThumbs = Thumb.getDistanceBetweenThumbs(
      firstThumbOffsetPercent,
      secondThumbOffsetPercent,
    );

    this.bar.update({
      firstThumbOffsetPercent,
      distanceBetweenThumbs,
      isRange,
      isVertical,
    });
  }

  private updateTips({
    fromValue,
    toValue,
    isRange,
    isVertical,
  }: UpdateTipsProps) {
    if (isRange) {
      this.setTipsOffset(isVertical);
    } else {
      this.removeTipsOffset();
    }

    this.firstThumb.tip.update(String(fromValue));
    this.secondThumb.tip.update(String(toValue));
  }

  private removeTipsOffset() {
    this.firstThumb.tip.removeOffset();
    this.secondThumb.tip.removeOffset();
  }

  private setTipsOffset(isVertical: boolean) {
    const size = getSizeLiteral(isVertical);

    this.firstThumb.tip.resetOffset();
    this.secondThumb.tip.resetOffset();

    const firstTipRect = this.firstThumb.tip.element.getBoundingClientRect();
    const secondTipRect = this.secondThumb.tip.element.getBoundingClientRect();

    const firstTipCorner = isVertical
      ? firstTipRect.bottom
      : firstTipRect.right;
    const secondTipCorner = isVertical ? secondTipRect.top : secondTipRect.left;

    const distanceBetweenTips = Tip.getDistanceBetweenTips(
      firstTipCorner,
      secondTipCorner,
    );

    if (distanceBetweenTips <= 0) {
      const tipSize = firstTipRect[size];
      const absDistance = Math.abs(distanceBetweenTips);
      const offsetPercent = getPercentOfNumber(absDistance, tipSize) / 2;
      const CENTER_OFFSET_PERCENT = -50;

      const firstTipOffset = CENTER_OFFSET_PERCENT - offsetPercent;
      const secondTipOffset = CENTER_OFFSET_PERCENT + offsetPercent;

      this.firstThumb.tip.setOffset({ isVertical, offset: firstTipOffset });
      this.secondThumb.tip.setOffset({ isVertical, offset: secondTipOffset });
    } else {
      this.removeTipsOffset();
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
}

export default View;
