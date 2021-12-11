import createElement from '@/helpers/createElement';

class Track {
  element: HTMLElement | null;

  constructor() {
    this.element = null;
  }

  render(parent: HTMLElement, isVertical: boolean) {
    this.element = createElement('div', { class: 'slider-track' });

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
