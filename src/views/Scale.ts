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

  getMarkWidth(minElement: string, maxElement: string) {
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

    const markWidth = mark.getBoundingClientRect().width;
    mark.remove();

    return markWidth;
  }

  resizeArrayOfValues(values: string[] | number[], newLength: number) {
    if (values.length <= newLength) return values;

    const step = Math.ceil((values.length - 1) / newLength);
    const resizedArray = [];
    let nextIndex = 0;
    let index = 0;

    while (index < newLength) {
      resizedArray.push(values[nextIndex]);
      nextIndex += step;
      index += 1;
    }

    resizedArray.push(values[values.length - 1]);
    return resizedArray;
  }

  render(parent: HTMLElement, state: SliderSettings) {
    const { values, showScale } = state;

    this.state = state;
    this.parent = parent;
    this.element.innerHTML = '';

    const markWidth = this.getMarkWidth(
      String(values[0]),
      String(values[values.length - 1]),
    );
    const sliderWidth = this.parent.getBoundingClientRect().width;
    const itemsInScale = Math.floor(sliderWidth / markWidth) - 1;
    const scaleItems = this.resizeArrayOfValues(values, itemsInScale);

    values.forEach((item: number | string, index: number) => {
      if (scaleItems.indexOf(item) === -1) return;

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
