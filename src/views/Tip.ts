import createElement from '@/helpers/createElement';

class Tip {
  element: HTMLElement | null;

  constructor() {
    this.element = null;
  }

  render(parent: HTMLElement, value: number, isVertical: boolean) {
    this.element = createElement('div', { class: 'slider-tip' });
    this.element.innerText = String(value);
    if (isVertical) this.element.classList.add('slider-tip--vertical');
    parent.append(this.element);
  }

  setValue(value: number) {
    if (!this.element) return;

    this.element.innerText = String(value);
  }
}

export default Tip;
