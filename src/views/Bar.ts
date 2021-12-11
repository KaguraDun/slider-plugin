import createElement from '@/helpers/createElement';

class Bar {
  element: HTMLElement | null;

  constructor() {
    this.element = null;
  }

  render(parent: HTMLElement) {
    this.element = createElement('div', { class: 'slider-bar' });
    parent.append(this.element);
  }

  update(firstThumbOffset: number) {
    if (!this.element) return;

    this.element.style.width = `${String(firstThumbOffset)}px`;
  }

  updateRange(firstThumbOffset: number, secondThumbOffset: number) {
    if (!this.element) return;

    const distanceBetween = secondThumbOffset - firstThumbOffset;

    this.element.style.left = `${String(firstThumbOffset)}px`;
    this.element.style.width = `${String(distanceBetween)}px`;
  }
}

export default Bar;
