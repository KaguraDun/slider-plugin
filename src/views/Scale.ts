import createElement from '@/helpers/createElement';
import SliderSettings, { SliderState } from '@/models/SliderSetting';
import { Subject } from '@/observer/Observer';
import ThumbID from '@/models/ThumbID';

interface GetMarkWidthProps {
  minElement: string;
  maxElement: string;
  isVertical: boolean;
}

class Scale {
  private state: SliderState | null;
  parent: HTMLElement | null;
  private scaleClickEvent: Subject;
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

  getClosestThumb(markID: number) {
    const { fromIndex, toIndex } = this.state;
    const distanceToFirst = Math.abs(markID - fromIndex);
    const distanceToSecond = Math.abs(markID - toIndex);

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
    let closestThumb;

    if (this.state?.isRange) {
      closestThumb = this.getClosestThumb(ID);
    } else {
      closestThumb = ThumbID.from;
    }

    this.scaleClickEvent.notify({ [`${closestThumb}Index`]: ID });
  }

  getMarkWidth({ minElement, maxElement, isVertical }: GetMarkWidthProps) {
    const widerElement =
      minElement.length >= maxElement.length ? minElement : maxElement;

    // create fake mark to access element width
    const mark = createElement(
      'span',
      {
        class: 'slider__scale-mark',
        style: 'position: absolute; opacity:0',
      },
      [`${widerElement}`],
    );

    this.parent?.append(mark);
    const markSizes = mark.getBoundingClientRect();
    const markWidth = isVertical ? markSizes.height : markSizes.width;
    mark.remove();

    return markWidth;
  }

  render(parent: HTMLElement, state: SliderSettings) {
    const { values, showScale, isVertical } = state;

    this.state = state;
    this.parent = parent;
    this.element.innerHTML = '';

    const markWidth = this.getMarkWidth({
      minElement: String(values[0]),
      maxElement: String(values[values.length - 1]),
      isVertical,
    });
    const sliderWidth = this.parent.getBoundingClientRect().width;
    const itemsInScale = Math.floor(sliderWidth / markWidth) - 1;
    const step = Math.ceil(values.length / itemsInScale);

    values.forEach((item: number | string, index: number) => {
      if (index !== values.length - 1) {
        if (index % step !== 0) return;
      }

      const mark = createElement(
        'span',
        { class: 'slider__scale-mark', ['data-id']: String(index) },
        [String(item)],
      );
      this.element?.append(mark);
    });

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
