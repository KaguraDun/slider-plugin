import createElement from '@/helpers/createElement';
import SliderSettings from '@/models/SliderSetting';
import { Subject } from '@/observer/Observer';
import ThumbID from '@/models/ThumbID';

class Scale {
  state: SliderSettings | null;
  parent: HTMLElement | null;
  scaleClickEvent: Subject;
  element: HTMLElement;

  constructor(scaleClick: Subject) {
    this.state = null;
    this.parent = null;
    this.scaleClickEvent = scaleClick;
    this.element = createElement('div', {
      class: 'slider__scale',
    });

    this.handleScaleClick = this.handleScaleClick.bind(this);
  }

  getClosestThumb(ID: number) {
    const { fromIndex, toIndex } = this.state;

    if (!fromIndex || !toIndex) return;

    const distanceToFirst = Math.abs(ID - fromIndex);
    const distanceToSecond = Math.abs(ID - toIndex);

    if (distanceToFirst <= distanceToSecond) {
      return ThumbID.from;
    } else {
      return ThumbID.to;
    }
  }

  handleScaleClick(clickEvent: MouseEvent) {
    const target = <HTMLElement>clickEvent.target;
    const closest = target.closest('.slider__scale-mark');

    if (!closest) return;

    const ID = Number(target.dataset.id);
    const closestThumb = this.getClosestThumb(ID);

    this.scaleClickEvent.notify({ [`${closestThumb}Index`]: ID });
  }

  render(parent: HTMLElement, state: SliderSettings) {
    this.state = state;

    const { values, showScale } = state;

    if (!values || !showScale) return;

    const numberOfMiddleItems = 3;
    const lastItem = 1;
    const itemsStep = Math.round(
      values?.length / numberOfMiddleItems - lastItem,
    );

    this.parent = parent;
    this.element.innerHTML = '';

    values?.forEach((item, index) => {
      const isMiddleItem = index > 0 && index < values.length - 1;
      const isFitToItemsStep = index % itemsStep === 0;

      if (isMiddleItem) {
        if (!isFitToItemsStep) return;
      }

      const mark = createElement(
        'span',
        { class: 'slider__scale-mark', ['data-id']: String(index) },
        [String(item)],
      );
      this.element?.append(mark);
    });

    // if (isVertical) this.element.classList.add('slider-scale--vertical');
    this.show(showScale);
  }

  show(showScale: boolean) {
    if (showScale) {
      this.parent?.append(this.element);
      this.element.addEventListener('click', this.handleScaleClick);
    } else {
      this.element.remove();
    }
  }
}

export default Scale;
