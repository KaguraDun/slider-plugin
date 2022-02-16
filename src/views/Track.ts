import createElement from '@/helpers/createElement';
import { getSizeLiteral } from '@/helpers/getLiteral';
import { ObserverEvents } from '@/observer/ObserverEvents';
import SliderState from '@/models/SliderState';

type ClickEventArguments = Pick<SliderState, 'isVertical' | 'maxIndex'>;

class Track {
  readonly element: HTMLElement;
  private trackClicked: ObserverEvents['trackClicked'];
  private clickEventArguments: ClickEventArguments | undefined;

  constructor(observerEvents: ObserverEvents) {
    this.element = createElement('div', { class: 'slider__track' });
    this.trackClicked = observerEvents.trackClicked;
    this.clickEventArguments = undefined;
  }

  render(parent: HTMLElement) {
    this.element.addEventListener('click', this.handleClick);
    parent.append(this.element);
  }

  setClickEventArguments(clickEventArguments: ClickEventArguments) {
    this.clickEventArguments = clickEventArguments;
  }

  private handleClick = (event: MouseEvent) => {
    if (this.clickEventArguments === undefined) return;

    const { isVertical, maxIndex } = this.clickEventArguments;

    const target = event.target as HTMLElement;
    const closest = target.closest('.slider__track');

    if (closest !== this.element) return;

    const size = getSizeLiteral(isVertical);

    const offsetX = event.clientX - this.element.getBoundingClientRect().left;
    const offsetY = event.clientY - this.element.getBoundingClientRect().top;
    const offset = isVertical ? offsetY : offsetX;

    const trackSize = this.element.getBoundingClientRect()[size];

    const pxPerValue = trackSize / maxIndex;
    const clickedIndex = Math.round(offset / pxPerValue);

    this.trackClicked.notify(clickedIndex);
  };
}

export default Track;
