import createElement from '@/helpers/createElement';
class Scale {
  element: HTMLElement | null;

  constructor() {
    this.element = null;
  }

  render(parent: HTMLElement, values: []) {
    this.element = createElement('div', { class: 'slider-scale' });

    values.forEach((item) => {
      const mark = createElement('div', { class: 'slider-scale-mark' });
      mark.innerText = item;
      this.element?.append(mark);
    });

    // if (isVertical) this.element.classList.add('slider-scale--vertical');

    parent.append(this.element);
  }
}

export default Scale;
