import createElement from '@/helpers/createElement';
import { getDirectionLiteral, getSizeLiteral } from '@/helpers/getLiteral';

interface UpdateProps {
  firstThumbOffsetPercent: number;
  distanceBetweenThumbs: number;
  isRange: boolean;
  isVertical: boolean;
}

class Bar {
  readonly parent: HTMLElement;
  readonly element: HTMLElement;

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
    firstThumbOffsetPercent,
    distanceBetweenThumbs,
    isRange,
    isVertical,
  }: UpdateProps) {
    const direction = getDirectionLiteral(isVertical);
    const size = getSizeLiteral(isVertical);

    this.resetSize();

    if (isRange) {
      this.element.style[direction] = `${firstThumbOffsetPercent}%`;
      this.element.style[size] = `${distanceBetweenThumbs}%`;
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
