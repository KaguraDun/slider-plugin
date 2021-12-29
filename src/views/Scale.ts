import createElement from '@/helpers/createElement';
import { getDirectionLiteral, getSizeLiteral } from '@/helpers/getLiteral';
import getPercentOfNumber from '@/helpers/getPercentOfNumber';
import SliderSettings, { SliderState } from '@/models/SliderSetting';
import ThumbID from '@/models/ThumbID';
import { Subject } from '@/observer/Observer';

interface RenderProps {
  sliderElement: HTMLElement;
  state: SliderState;
  percentPerMark: number;
  thumbRect: DOMRect;
}

interface GetMarkWidthProps {
  minElement: string;
  maxElement: string;
  isVertical: boolean;
}

class Scale {
  parent: HTMLElement | null;
  percentPerMark: number;
  element: HTMLElement;
  private scaleClickEvent: Subject;
  private state: SliderState | null;

  constructor(scaleClick: Subject) {
    this.parent = null;
    this.percentPerMark = 0;
    this.element = createElement('div', {
      class: 'slider__scale',
    });
    this.handleScaleClick = this.handleScaleClick.bind(this);
    this.scaleClickEvent = scaleClick;
    this.state = null;
  }

  render({ sliderElement, state, percentPerMark, thumbRect }: RenderProps) {
    const { values, showScale, isVertical } = state;

    this.state = state;
    this.parent = sliderElement;
    this.percentPerMark = percentPerMark;
    this.element.innerHTML = '';

    const markWidth = this.getMarkWidth({
      minElement: String(values[0]),
      maxElement: String(values[values.length - 1]),
      isVertical,
    });

    const direction = getDirectionLiteral(isVertical);
    const size = getSizeLiteral(isVertical);

    const sliderSize = this.parent.getBoundingClientRect()[size];

    const itemsInScale = Math.ceil(sliderSize / markWidth) - 1;
    const step = Math.round(values.length / itemsInScale);

    const translateX = isVertical ? 0 : thumbRect[size];
    const translateY = isVertical ? thumbRect[size] : 0;

    const thumbOffset = thumbRect[size] / 2 + markWidth / 2;
    const thumbOffsetPercent = getPercentOfNumber(thumbOffset, sliderSize);

    values.forEach((item: number | string, index: number) => {
      const isLastElement = index === values.length - 1;
      const isFitToStep = index % step === 0;

      if (!isLastElement) {
        if (!isFitToStep) return;
      }
      const markOffset = index * this.percentPerMark - thumbOffsetPercent;

      const mark = createElement(
        'span',
        {
          class: 'slider__scale-mark',
          ['data-id']: String(index),
          style: `${direction}:${markOffset}%;
          width: ${markWidth}px;
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
    }
  }

  private getClosestThumb(markID: number): ThumbID {
    const { fromIndex, toIndex, isRange } = this.state;

    if (!isRange) return ThumbID.from;

    const distanceToFirst = Math.abs(markID - fromIndex);
    const distanceToSecond = Math.abs(markID - toIndex);

    if (distanceToFirst <= distanceToSecond) {
      return ThumbID.from;
    } else {
      return ThumbID.to;
    }
  }

  private handleScaleClick(clickEvent: MouseEvent) {
    const target = <HTMLElement>clickEvent.target;
    const closest = target.closest('.slider__scale-mark');

    if (!closest) return;

    const { values } = this.state;

    const valueIndex = Number(target.dataset.id);
    const closestThumb = this.getClosestThumb(valueIndex);

    const value = values[valueIndex];

    this.scaleClickEvent.notify({ [closestThumb]: value });
  }

  private getMarkWidth({
    minElement,
    maxElement,
    isVertical,
  }: GetMarkWidthProps) {
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
    const markSizes = mark.getBoundingClientRect();
    const markWidth = isVertical ? markSizes.height : markSizes.width;
    mark.remove();

    return markWidth;
  }
}

export default Scale;
