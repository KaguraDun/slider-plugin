import createElement from '../helpers/createElement';

class Track {
  element: HTMLElement;

  constructor() {
    this.element;
  }

  render(parent: HTMLElement, isVertical: boolean) {
    this.element = createElement('div', 'slider-track');
    if (isVertical) {
      parent.classList.add('slider--vertical');
      this.element.classList.add('slider-track--vertical');
    } else {
      parent.classList.remove('slider--vertical');
    }
    parent.append(this.element);
  }
}

export default Track;
