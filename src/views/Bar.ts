import createElement from '@/assets/helpers/createElement';
import getPercentOfNumber from '@/assets/helpers/getPercentOfNumber';
import {
  getDirectionLiteral,
  getOffsetLiteral,
  getSizeLiteral,
} from '@/assets/helpers/getLiteral';

interface ThumbOffset {
  offsetLeft: number;
  offsetTop: number;
}

interface ThumbSize {
  width: number;
  height: number;
}

interface UpdateProps {
  firstThumbOffset: ThumbOffset;
  secondThumbOffset: ThumbOffset;
  thumbSize: ThumbSize;
  isRange: boolean;
  isVertical: boolean;
}

class Bar {
  parent: HTMLElement;
  element: HTMLElement;

  constructor(parent: HTMLElement) {
    this.parent = parent;
    this.element = createElement('div', { class: 'slider__bar' });
  }

  show(showBar: boolean) {
    if (showBar) {
      this.parent.append(this.element);
    } else {
      this.element.remove();
    }
  }

  update({
    firstThumbOffset,
    secondThumbOffset,
    thumbSize,
    isRange,
    isVertical,
  }: UpdateProps) {
    const direction = getDirectionLiteral(isVertical);
    const offset = getOffsetLiteral(isVertical);
    const size = getSizeLiteral(isVertical);

    const trackSize = this.parent.getBoundingClientRect()[size];
    const thumbHalfSize = thumbSize[size] / 2;

    const firstThumbOffsetPercent = getPercentOfNumber(
      firstThumbOffset[offset] + thumbHalfSize,
      trackSize,
    );
    const secondThumbOffsetPercent = getPercentOfNumber(
      secondThumbOffset[offset] + thumbHalfSize,
      trackSize,
    );

    this.resetSize();

    if (isRange) {
      const distanceBetween =
        secondThumbOffsetPercent - firstThumbOffsetPercent;

      this.element.style[direction] = `${firstThumbOffsetPercent}%`;
      this.element.style[size] = `${distanceBetween}%`;
    } else {
      this.element.style[size] = `${firstThumbOffsetPercent}%`;
    }
  }

  private resetSize() {
    this.element.style.width = '100%';
    this.element.style.height = '100%';
    this.element.style.top = '0';
    this.element.style.left = '0';
  }
}
export default Bar;
