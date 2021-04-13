import createElement from '../helpers/createElement';

class Tip {
  element: HTMLElement;
  parent: HTMLElement;
  from: number;

  constructor() {
    this.element;
  }

  render(parent: HTMLElement, value: number) {
    this.element = createElement('div', 'tip');
    this.element.innerText = String(value);

    parent.append(this.element);
  }

  setValue(value: number) {
    this.element.innerText = String(value);
  }
}

export default Tip;
