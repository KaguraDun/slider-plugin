import createElement from '@/helpers/createElement';
import getPercentOfNumber from '@/helpers/getPercentOfNumber';
import { getDirectionLiteral, getSizeLiteral } from '@/helpers/getLiteral';
import SliderState from '@/models/SliderState';
import ThumbID from '@/models/ThumbID';
import { ObserverEvents } from '@/observer/ObserverEvents';

interface RenderProps {
  sliderElement: HTMLElement;
  state: SliderState;
  percentPerMark: number;
  thumbRect: DOMRect;
}

interface GetMarkSizeProps {
  minElement: string;
  maxElement: string;
  size: 'height' | 'width';
}

interface GetStepProps {
  sliderSize: number;
  markSize: number;
  valuesLength: number;
}

interface GetClosestThumbProps {
  markID: number;
  fromIndex: SliderState['fromIndex'];
  toIndex: SliderState['toIndex'];
  isRange: SliderState['isRange'];
}

class Scale {
  parent: HTMLElement | null;
  percentPerMark: number;
  element: HTMLElement;
  private scaleClickEvent: ObserverEvents['scaleClick'];
  private state: SliderState | undefined;

  constructor(observerEvents: ObserverEvents) {
    this.parent = null;
    this.percentPerMark = 0;
    this.element = createElement('div', {
      class: 'slider__scale',
    });
    this.scaleClickEvent = observerEvents.scaleClick;
    this.state = undefined;
  }

  render({ sliderElement, state, percentPerMark, thumbRect }: RenderProps) {
    const { values, showScale, isVertical } = state;

    this.state = state;
    this.parent = sliderElement;
    this.percentPerMark = percentPerMark;
    this.element.innerHTML = '';

    const direction = getDirectionLiteral(isVertical);
    const size = getSizeLiteral(isVertical);

    const markSize = this.getMarkSize({
      minElement: String(values[0]),
      maxElement: String(values[values.length - 1]),
      size,
    });

    const sliderSize = this.parent.getBoundingClientRect()[size];
    const stepArray = this.getStepArray({
      sliderSize,
      markSize,
      valuesLength: values.length - 1,
    });

    const translateX = isVertical ? 0 : thumbRect[size];
    const translateY = isVertical ? thumbRect[size] : 0;

    const thumbOffset = thumbRect[size] / 2 + markSize / 2;
    const thumbOffsetPercent = getPercentOfNumber(thumbOffset, sliderSize);

    stepArray.forEach((item: number) => {
      const markOffset = item * this.percentPerMark - thumbOffsetPercent;

      const mark = createElement(
        'span',
        {
          class: 'slider__scale-mark',
          ['data-id']: String(item),
          style: `${direction}: ${markOffset}%;
          width: ${markSize}px;
          transform:translate(${translateX}px, ${translateY}px);
          `,
        },
        [String(values[item])],
      );

      this.element?.append(mark);
    });

    this.show(showScale);
  }

  show(showScale: boolean) {
    if (showScale) {
      this.parent?.append(this.element);
      this.element.addEventListener('click', this.handleScaleClick);
    } else {
      this.element.remove();
      this.element.removeEventListener('click', this.handleScaleClick);
    }
  }

  private getStepArray({ sliderSize, markSize, valuesLength }: GetStepProps) {
    let maxMarksInScale = Math.floor(sliderSize / markSize);
    let step = valuesLength / maxMarksInScale;
    const stepArray = [];

    for (let i = 0; i <= maxMarksInScale; i += 1) {
      stepArray.push(Math.round(step * i));
    }

    return Array.from(new Set(stepArray));
  }

  private getClosestThumb({
    markID,
    fromIndex,
    toIndex,
    isRange,
  }: GetClosestThumbProps): ThumbID {
    const isToExist = isRange && toIndex !== undefined;
    if (!isToExist) return ThumbID.from;

    const distanceToFirst = Math.abs(markID - fromIndex);
    const distanceToSecond = Math.abs(markID - toIndex);

    const isFirstThumb =
      distanceToFirst < distanceToSecond || markID < fromIndex;

    if (isFirstThumb) return ThumbID.from;

    return ThumbID.to;
  }

  private handleScaleClick = (clickEvent: MouseEvent) => {
    const target = clickEvent.target as HTMLElement;
    const closest = target.closest('.slider__scale-mark');

    const isAvailableToClick = closest && this.state;
    if (!isAvailableToClick) return;

    const { fromIndex, toIndex, isRange, values } = this.state!;

    const valueIndex = Number(target.dataset.id);
    const closestThumb = this.getClosestThumb({
      markID: valueIndex,
      fromIndex,
      toIndex,
      isRange,
    });

    const value = values[valueIndex];

    this.scaleClickEvent.notify({ [closestThumb]: value });
  };

  private getMarkSize({ minElement, maxElement, size }: GetMarkSizeProps) {
    const widerElement =
      minElement.length >= maxElement.length ? minElement : maxElement;

    // create fake mark to access element width
    const singleMark = createElement(
      'span',
      {
        class: 'slider__scale-mark',
        style: 'position: absolute; opacity: 0',
      },
      [widerElement],
    );

    this.parent?.append(singleMark);

    const markSize = singleMark.getBoundingClientRect()[size];
    singleMark.remove();

    return markSize;
  }
}

export default Scale;
