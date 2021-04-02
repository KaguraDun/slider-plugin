import createElement from '../helpers/createElement';

class Tip {
  element: HTMLElement;
  parent: HTMLElement;
  from: number;

  constructor() {
    this.element;
  }

  render(parent: HTMLElement, from: number) {
    this.element = createElement('div', 'tip');
    this.element.innerText = String(from);

    parent.append(this.element);
  }

  setValue(from: number) {
    this.element.innerText = String(from);
  }
}

export default Tip;
