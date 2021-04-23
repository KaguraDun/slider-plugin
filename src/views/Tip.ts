import createElement from '../helpers/createElement';

class Tip {
  element: HTMLElement;
  parent: HTMLElement;
  from: number;

  constructor() {
    this.element;
  }

  render(parent: HTMLElement, value: number, isVertical :boolean) {
    this.element = createElement('div', 'slider-tip');
    this.element.innerText = String(value);
    if (isVertical) this.element.classList.add('slider-tip--vertical')
    parent.append(this.element);
  }

  setValue(value: number) {
    this.element.innerText = String(value);
  }
}

export default Tip;
