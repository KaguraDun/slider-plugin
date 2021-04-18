import createElement from '../helpers/createElement';

class Scale {
  element: HTMLElement;
  parent: HTMLElement;
  from: number;

  constructor() {
    this.element;
  }

  render(parent: HTMLElement, params: any) {
    const { min, max, step, isVertical } = params;

    this.element = createElement('div', 'scale');

    const markCount = (max - min) / step;

    for (let i = 0; i <= markCount; i += 1) {
      const mark = createElement('div', 'scale-mark');
      mark.innerText = String(min + i * step);
      this.element.append(mark);
    }
    
    if (isVertical) this.element.classList.add('slider-scale--vertical');

    parent.append(this.element);
  }
}

export default Scale;
