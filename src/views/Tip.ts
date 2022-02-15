import createElement from '@/helpers/createElement';
import SliderState from '@/models/SliderState';

interface RenderProps {
  value: string;
  showTip: SliderState['showTip'];
}

interface SetOffsetProps {
  isVertical: SliderState['isVertical'];
  offset: number;
}

class Tip {
  readonly parent: HTMLElement;
  readonly element: HTMLElement;

  constructor(parent: HTMLElement) {
    this.parent = parent;
    this.element = createElement('span', { class: 'slider__tip' });
  }

  render({ value, showTip }: RenderProps) {
    this.update(value);
    this.show(showTip);
  }

  update(value: RenderProps['value']) {
    this.element.innerText = value;
  }

  show(showTip: RenderProps['showTip']) {
    if (showTip) {
      this.parent.append(this.element);
    } else {
      this.element.remove();
    }
  }

  setOffset({ isVertical, offset }: SetOffsetProps) {
    const defaultVerticalOffset = -130;

    if (isVertical) {
      this.element.style.transform = `translate(${defaultVerticalOffset}%,${offset}%)`;
    } else {
      this.element.style.transform = `translate(${offset}%)`;
    }
  }

  removeOffset() {
    this.element.style.removeProperty('transform');
  }

  resetOffset() {
    this.element.style.transform = 'none';
  }

  static getDistanceBetweenTips(
    firstTipOffsetPercent: number,
    secondTipOffsetPercent: number,
  ) {
    return secondTipOffsetPercent - firstTipOffsetPercent;
  }
}

export default Tip;
