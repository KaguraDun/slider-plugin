import createElement from '@/helpers/createElement';

interface TipProps {
  parent: HTMLElement;
  value: number | string;
  isVertical: boolean;
  showTip: boolean;
}

class Tip {
  element: HTMLElement;
  parent: HTMLElement | null;

  constructor() {
    this.parent = null;
    this.element = createElement('div', { class: 'slider__tip' });
  }

  render({ parent, value, isVertical, showTip }: TipProps) {
    this.parent = parent;
    this.element.innerText = String(value);

    if (isVertical) this.element.classList.add('slider__tip--vertical');
    this.show(showTip);
  }

  update(value: number | string) {
    if (!this.element) return;

    this.element.innerText = String(value);
  }

  show(showTip: boolean) {
    if (showTip && this.parent) {
      this.parent.append(this.element);
    } else {
      this.element.remove();
    }
  }
}

export default Tip;
