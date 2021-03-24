import createElement from '../helpers/createElement';

class Thumb {
  element: HTMLElement;
  parent: HTMLElement;
  from: number;
  handler: Function;

  constructor() {
    this.element;
  }

  render(parent: HTMLElement, from: number, handler: Function) {
    this.element = createElement('div', 'thumb');
    this.element.style.left = `${from}px`;
    this.element.innerText = String(from);
    this.element.addEventListener('mousedown', handler);

    parent.append(this.element);
  }

  move(from: number) {
    this.element.style.left = `${from}px`;
  }
}

export default Thumb;
