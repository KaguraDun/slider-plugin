import createElement from '@/helpers/createElement';
import {
  getDirectionLiteral,
  getOffsetLiteral,
  getSizeLiteral,
} from '@/helpers/getLiteral';
import getPercentOfNumber from '@/helpers/getPercentOfNumber';

interface UpdateProps {
  firstThumb: HTMLElement;
  secondThumb: HTMLElement;
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

  update({ firstThumb, secondThumb, isRange, isVertical }: UpdateProps) {
    const direction = getDirectionLiteral(isVertical);
    const offset = getOffsetLiteral(isVertical);
    const size = getSizeLiteral(isVertical);

    const trackSize = this.parent.getBoundingClientRect()[size];

    const firstThumbOffset = getPercentOfNumber(firstThumb[offset], trackSize);
    const secondThumbOffset = getPercentOfNumber(
      secondThumb[offset],
      trackSize,
    );

    this.resetSize();

    if (isRange) {
      const distanceBetween = secondThumbOffset - firstThumbOffset;

      this.element.style[direction] = `${firstThumbOffset}%`;
      this.element.style[size] = `${distanceBetween}%`;
    } else {
      this.element.style[size] = `${firstThumbOffset}%`;
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
