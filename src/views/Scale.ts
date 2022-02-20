import createElement from '@/helpers/createElement';
import getPercentOfNumber from '@/helpers/getPercentOfNumber';
import getDecimalPlaces from '@/helpers/getDecimalPlaces';
import { getDirectionLiteral, getSizeLiteral } from '@/helpers/getLiteral';
import SliderState from '@/models/SliderState';
import { ObserverEvents } from '@/observer/ObserverEvents';

interface RenderProps {
  state: SliderState;
  percentPerMark: number;
  thumbRect: DOMRect;
}

interface GetMarkSizeProps {
  min: SliderState['min'];
  max: SliderState['max'];
  step: SliderState['step'];
  size: 'height' | 'width';
}

interface GetStepProps {
  sliderSize: number;
  markSize: number;
  valuesLength: number;
}

class Scale {
  readonly parent: HTMLElement;
  readonly element: HTMLElement;
  private percentPerMark: number;
  private scaleClickEvent: ObserverEvents['scaleMarkClicked'];

  constructor(parent: HTMLElement, observerEvents: ObserverEvents) {
    this.parent = parent;
    this.element = createElement('div', {
      class: 'slider__scale',
    });
    this.percentPerMark = 0;
    this.scaleClickEvent = observerEvents.scaleMarkClicked;
  }

  render({ state, percentPerMark, thumbRect }: RenderProps) {
    const { values, min, max, step, showScale, isVertical } = state;

    this.percentPerMark = percentPerMark;
    this.element.innerHTML = '';

    const direction = getDirectionLiteral(isVertical);
    const size = getSizeLiteral(isVertical);

    const markSize = this.getMarkSize({
      min,
      max,
      step,
      size,
    });

    const trackSize = this.parent.getBoundingClientRect()[size];
    const sliderSize = trackSize + thumbRect[size];
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
          ${size}: ${markSize}px;
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
      this.parent.append(this.element);
      this.element.addEventListener('click', this.handleScaleClick);
    } else {
      this.element.remove();
      this.element.removeEventListener('click', this.handleScaleClick);
    }
  }

  private getStepArray({ sliderSize, markSize, valuesLength }: GetStepProps) {
    let maxMarksInScale = Math.floor(sliderSize / markSize);

    if (valuesLength - maxMarksInScale === 1) {
      maxMarksInScale += 1;
    } else {
      maxMarksInScale -= 1;
    }

    let step = valuesLength / maxMarksInScale;
    const stepArray = [];

    for (let i = 0; i <= maxMarksInScale; i += 1) {
      stepArray.push(Math.round(step * i));
    }

    return Array.from(new Set(stepArray));
  }

  private handleScaleClick = (clickEvent: MouseEvent) => {
    const target = clickEvent.target as HTMLElement;
    const closest = target.closest('.slider__scale-mark');

    if (!closest) return;

    const valueIndex = Number(target.dataset.id);

    this.scaleClickEvent.notify(valueIndex);
  };

  private getMarkSize({ min, max, step, size }: GetMarkSizeProps) {
    const decimalPlaces = Math.max(
      getDecimalPlaces(min),
      getDecimalPlaces(max),
      getDecimalPlaces(step),
    );

    const strMin = String(min);
    const strMax = String(max);

    let widerElement = strMin.length >= strMax.length ? strMin : strMax;

    if (decimalPlaces > 0) {
      const intPart = Math.trunc(Number(widerElement));
      widerElement = `${intPart}.${['0'.repeat(decimalPlaces)]}`;
    }

    // create fake mark to access element width
    const singleMark = createElement(
      'span',
      {
        class: 'slider__scale-mark',
        style: 'position: absolute; opacity: 0',
      },
      [widerElement],
    );

    this.parent.append(singleMark);

    const DEFAULT_MARK_SIZE = 10;

    let markSize = singleMark.getBoundingClientRect()[size];
    singleMark.remove();

    if (markSize <= 0) {
      markSize = DEFAULT_MARK_SIZE;
    }

    return markSize;
  }
}

export default Scale;
