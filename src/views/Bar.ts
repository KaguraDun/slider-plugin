import createElement from '@/helpers/createElement';

interface UpdateProps {
  firstThumbOffset: number;
  secondThumbOffset: number;
  isRange: boolean;
}

class Bar {
  parent: HTMLElement;
  element: HTMLElement;

  constructor(parent: HTMLElement) {
    this.parent = parent;
    this.element = createElement('div', { class: 'slider__bar' });
  }

  show(showBar: boolean) {
    if (showBar) {
      this.parent.append(this.element);
    } else {
      this.element.remove();
    }
  }

  update({ firstThumbOffset, secondThumbOffset, isRange }: UpdateProps) {
    this.element.style.left = '0';
    this.element.style.width = `${String(firstThumbOffset)}px`;

    if (isRange) {
      const distanceBetween = secondThumbOffset - firstThumbOffset;

      this.element.style.left = `${String(firstThumbOffset)}px`;
      this.element.style.width = `${String(distanceBetween)}px`;
    }
  }
}
export default Bar;
