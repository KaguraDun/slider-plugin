import createElement from '@/helpers/createElement';
import getPercentOfNumber from '@/helpers/getPercentOfNumber';
import { getSizeLiteral, getOffsetLiteral } from '@/helpers/getLiteral';
import SliderState from '@/models/SliderState';
import ThumbID from '@/models/ThumbID';
import { ObserverEvents } from '@/observer/ObserverEvents';

import Tip from './Tip';

interface ThumbProperties {
  parent: HTMLElement;
  thumbID: string;
  observerEvents: ObserverEvents;
}

interface MoveProps {
  valueIndex: number;
  isVertical: SliderState['isVertical'];
  maxIndex: SliderState['maxIndex'];
  values: SliderState['values'];
}

type GetPercentPerMarkProps = Pick<SliderState, 'isVertical' | 'maxIndex'>;

class Thumb {
  readonly parent: HTMLElement;
  readonly thumbID: string;
  readonly element: HTMLElement;
  readonly tip: Tip;
  private moveEvent: ObserverEvents['thumbMoved'];
  private moveArguments: MoveProps | null;

  constructor({ parent, thumbID, observerEvents }: ThumbProperties) {
    this.parent = parent;
    this.thumbID = thumbID;
    this.element = createElement('div', {
      class: 'slider__thumb',
    });
    this.tip = new Tip(this.element);
    this.moveEvent = observerEvents.thumbMoved;
    this.moveArguments = null;
  }

  getPercentPerMark({ isVertical, maxIndex }: GetPercentPerMarkProps) {
    if (!this.parent) return 0;

    const thumb = this.element.getBoundingClientRect();
    const track = this.parent.getBoundingClientRect();
    const size = getSizeLiteral(isVertical);

    const pxPerMark = (track[size] - thumb[size]) / maxIndex;
    const movePercent = getPercentOfNumber(pxPerMark, track[size]);

    return movePercent;
  }

  render(state: Readonly<SliderState>) {
    const { isRange, isVertical, fromIndex, toIndex, maxIndex, values } = state;

    this.element.addEventListener('pointerdown', this.handleDragThumb);
    this.element.addEventListener('dragstart', this.handleDragStart);

    this.show(isRange);

    if (this.thumbID === ThumbID.from) {
      this.move({ valueIndex: fromIndex, isVertical, maxIndex, values });
      return;
    }

    const shouldMoveTo = this.thumbID === ThumbID.to && toIndex !== undefined;
    if (shouldMoveTo) {
      this.move({ valueIndex: toIndex, isVertical, maxIndex, values });
      return;
    }
  }

  move(props: MoveProps) {
    const { valueIndex, isVertical, maxIndex } = props;
    this.moveArguments = props;

    if (!this.element.isConnected) return;

    const movePercent =
      this.getPercentPerMark({ isVertical, maxIndex }) * valueIndex;

    if (isVertical) {
      this.element.style.top = `${movePercent}%`;
      this.element.style.left = '0';
    } else {
      this.element.style.left = `${movePercent}%`;
      this.element.style.top = '0';
    }
  }

  show(isRange: boolean) {
    if (!isRange) {
      this.element.remove();
    } else {
      this.parent.append(this.element);
    }
  }

  renderTip(value: number, showTip: boolean) {
    this.tip.render({ value: String(value), showTip });
  }

  toggleTopElement(isTopElement: boolean) {
    this.element.classList.toggle('slider__thumb_top', isTopElement);
  }

  getOffsetPercent(isVertical: boolean) {
    const size = getSizeLiteral(isVertical);
    const offset = getOffsetLiteral(isVertical);

    const trackSize = this.parent.getBoundingClientRect()[size];
    const thumbSize = this.element.getBoundingClientRect()[size];

    const thumbOffset = this.element[offset];
    const thumbCenter = thumbOffset + thumbSize / 2;

    const thumbOffsetPercent = getPercentOfNumber(thumbCenter, trackSize);

    return thumbOffsetPercent;
  }

  static getDistanceBetweenThumbs(
    firstThumbOffsetPercent: number,
    secondThumbOffsetPercent: number,
  ) {
    return secondThumbOffsetPercent - firstThumbOffsetPercent;
  }

  private handleDragStart() {
    return false;
  }

  private handleDragThumb = (pointerDown: PointerEvent) => {
    pointerDown.preventDefault();

    const shiftX = pointerDown.clientX - this.element.offsetLeft;
    const shiftY = pointerDown.clientY - this.element.offsetTop;

    const handlePointerMove = (pointerMove: PointerEvent) => {
      if (!this.moveArguments) return;

      const { isVertical, maxIndex, values } = this.moveArguments;

      const offsetX = pointerMove.clientX - shiftX;
      const offsetY = pointerMove.clientY - shiftY;
      let offsetPx = isVertical ? offsetY : offsetX;

      if (offsetPx < 0) offsetPx = 0;

      const size = getSizeLiteral(isVertical);
      const parentSize = this.parent.getBoundingClientRect()[size];

      const offsetPercent = getPercentOfNumber(offsetPx, parentSize);
      let valueIndex = Math.round(
        offsetPercent / this.getPercentPerMark({ isVertical, maxIndex }),
      );

      if (valueIndex > maxIndex) valueIndex = maxIndex;

      const value = values[valueIndex];

      this.moveEvent.notify({ [this.thumbID]: value });
    };

    const handleMouseUp = () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handleMouseUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handleMouseUp);
  };
}

export default Thumb;
