import createElement from '../helpers/createElement';

class Track {
  element: HTMLElement;

  constructor() {
    this.element;
  }

  render(parent: HTMLElement) {
    this.element = createElement('div', 'track');
    parent.append(this.element);
  }
}

export default Track;
