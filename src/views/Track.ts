import createElement from '@/assets/helpers/createElement';

class Track {
  element: HTMLElement;

  constructor() {
    this.element = createElement('div', { class: 'slider__track' });
  }

  render(parent: HTMLElement) {
    parent.append(this.element);
  }
}

export default Track;
