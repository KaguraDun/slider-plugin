import createElement from '../helpers/createElement';
import Tip from './Tip';

class Thumb {
  element: HTMLElement;
  tip: Tip;

  constructor() {
    this.element;
    this.tip = new Tip();
  }

  render(parent: HTMLElement, handler: any) {
    this.element = createElement('div', 'thumb');
    this.element.addEventListener('mousedown', (e) => handler(e, this));
    this.element.ondragstart = function () {
      return false;
    };

    parent.append(this.element);
  }

  move(value: number) {
    this.element.style.left = `${value}px`;
  }

  renderTip(value: number) {
    this.tip.render(this.element, value);
  }
}

export default Thumb;
