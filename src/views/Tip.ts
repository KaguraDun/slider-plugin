import createElement from '@/helpers/createElement';

interface TipProps {
  parent: HTMLElement;
  value: string;
  showTip: boolean;
}

interface CheckIntersectionProps {
  firstTip: HTMLElement;
  secondTip: HTMLElement;
  isVertical: boolean;
}

class Tip {
  element: HTMLElement;
  parent: HTMLElement | null;

  constructor() {
    this.parent = null;
    this.element = createElement('div', { class: 'slider__tip' });
  }

  render({ parent, value, showTip }: TipProps) {
    this.parent = parent;

    this.update(value);
    this.show(showTip);
  }

  update(value: string) {
    if (!this.element) return;

    this.element.innerText = value;
  }

  show(showTip: boolean) {
    if (showTip && this.parent) {
      this.parent.append(this.element);
    } else {
      this.element.remove();
    }
  }

  toggleExpand(expanded: boolean) {
    this.element.classList.toggle(Tip.EXPANDED_MODIFIER, expanded);
  }

  static checkIntersection({
    firstTip,
    secondTip,
    isVertical,
  }: CheckIntersectionProps) {
    const firstTipRect = firstTip.getBoundingClientRect();
    const secondTipRect = secondTip.getBoundingClientRect();
    const isExpanded = firstTip.classList.contains(Tip.EXPANDED_MODIFIER);

    enum MatchSizes {
      unExpanded = 1,
      expanded = 2,
    }

    const matchSize = isExpanded ? MatchSizes.expanded : MatchSizes.unExpanded;
    let isIntersect = false;

    if (isVertical) {
      const secondTipArea = secondTipRect.height * matchSize;
      isIntersect = firstTipRect.top + secondTipArea >= secondTipRect.top;
    } else {
      const secondTipArea = secondTipRect.width;
      isIntersect = firstTipRect.left + secondTipArea >= secondTipRect.left;
    }

    return isIntersect;
  }

  static readonly EXPANDED_MODIFIER = 'slider__tip_expanded';
}

export default Tip;
