import createElement from '@/helpers/createElement';

class Slider {
  readonly element: HTMLElement;

  constructor() {
    this.element = createElement('div', { class: 'slider' });
  }

  render(parent: HTMLElement) {
    parent.append(this.element);
  }

  toggleVertical(isVertical: boolean) {
    this.element.classList.toggle('slider_vertical', isVertical);
  }
}

export default Slider;
