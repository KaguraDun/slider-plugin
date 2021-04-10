import createElement from '../helpers/createElement';

class Thumb {
  element: HTMLElement;

  constructor() {
    this.element;
  }

  render(parent: HTMLElement, handler: any) {
    this.element = createElement('div', 'thumb');
    this.element.addEventListener('mousedown', handler);
    this.element.ondragstart = function () {
      return false;
    };

    parent.append(this.element);
  }

  move(from: number) {
    this.element.style.left = `${from}px`;
  }
}

export default Thumb;
