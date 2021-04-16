import createElement from '../helpers/createElement';

class Bar {
  element: HTMLElement;

  constructor() {
    this.element;
  }

  render(parent: HTMLElement) {
    this.element = createElement('div', 'slider-bar');
    parent.append(this.element);
  }

  update(firstThumbOffset: number) {
    this.element.style.width = String(firstThumbOffset) + 'px';
  }

  updateRange(firstThumbOffset: number, secondThumbOffset: number) {
    const distanceBetween = secondThumbOffset - firstThumbOffset;

    this.element.style.left = String(firstThumbOffset) + 'px';
    this.element.style.width = String(distanceBetween) + 'px';
  }
}

export default Bar;
