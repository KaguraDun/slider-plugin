import createElement from '@/helpers/createElement';
import { getDirectionLiteral, getSizeLiteral } from '@/helpers/getLiteral';
import getPercentOfNumber from '@/helpers/getPercentOfNumber';
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
    const step = this.getStep({
      sliderSize,
      markSize,
      valuesLength: values.length,
    });

    const translateX = isVertical ? 0 : thumbRect[size];
    const translateY = isVertical ? thumbRect[size] : 0;

    const thumbOffset = thumbRect[size] / 2 + markSize / 2;
    const thumbOffsetPercent = getPercentOfNumber(thumbOffset, sliderSize);

    values.forEach((item: number, index: number) => {
      const isLastElement = index === values.length - 1;
      const isFitToStep = index % step === 0;
      const isSecondFromEndOverflowLast = index + step / 2 > values.length - 1;

      if (!isLastElement) {
        if (!isFitToStep || isSecondFromEndOverflowLast) return;
      }

      const markOffset = index * this.percentPerMark - thumbOffsetPercent;

      const mark = createElement(
        'span',
        {
          class: 'slider__scale-mark',
          ['data-id']: String(index),
          style: `${direction}:${markOffset}%;
          width: ${markSize}px;
          transform:translate(${translateX}px,${translateY}px);
          `,
        },
        [String(item)],
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

  private getStep({ sliderSize, markSize, valuesLength }: GetStepProps) {
    const itemsInScale = Math.ceil(sliderSize / markSize) - 1;
    let step = Math.round(valuesLength / itemsInScale);

    if (step <= 0) step = 1;

    return step;
  }

  private getClosestThumb({
    markID,
    fromIndex,
    toIndex,
    isRange,
  }: GetClosestThumbProps): ThumbID {
    if (!isRange || toIndex === undefined) return ThumbID.from;

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

    if (!closest || !this.state) return;

    const { fromIndex, toIndex, isRange, values } = this.state;

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
    const mark = createElement(
      'span',
      {
        class: 'slider__scale-mark',
        style: 'position: absolute; opacity:0',
      },
      [`${widerElement}`],
    );

    this.parent?.append(mark);

    const markSize = mark.getBoundingClientRect()[size];
    mark.remove();

    return markSize;
  }
}

export default Scale;
