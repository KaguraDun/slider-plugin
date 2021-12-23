import createElement from '@/helpers/createElement';

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

  resetSize() {
    this.element.style.width = '100%';
    this.element.style.height = '100%';
    this.element.style.top = '0';
    this.element.style.left = '0';
  }

  update({ firstThumb, secondThumb, isRange, isVertical }: UpdateProps) {
    const firstThumbOffset = isVertical
      ? firstThumb.offsetTop
      : firstThumb.offsetLeft;
    const secondThumbOffset = isVertical
      ? secondThumb.offsetTop
      : secondThumb.offsetLeft;
    const direction = isVertical ? 'top' : 'left';
    const size = isVertical ? 'height' : 'width';

    this.resetSize();

    this.element.style[size] = `${String(firstThumbOffset)}px`;

    if (isRange) {
      const distanceBetween = secondThumbOffset - firstThumbOffset;

      this.element.style[direction] = `${String(firstThumbOffset)}px`;
      this.element.style[size] = `${String(distanceBetween)}px`;
    }
  }
}
export default Bar;
