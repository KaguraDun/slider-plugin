import createElement from '@/helpers/createElement';

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

  update(
    firstThumbOffsetLeft: number,
    secondThumbOffsetLeft: number,
    isRange: boolean,
  ) {
    this.element.style.left = '0';
    this.element.style.width = `${String(firstThumbOffsetLeft)}px`;

    if (isRange) {
      const distanceBetween = secondThumbOffsetLeft - firstThumbOffsetLeft;

      this.element.style.left = `${String(firstThumbOffsetLeft)}px`;
      this.element.style.width = `${String(distanceBetween)}px`;
    }
  }
}
export default Bar;
