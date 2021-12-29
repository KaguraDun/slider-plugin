import createElement from '@/helpers/createElement';
import { getSizeLiteral } from '@/helpers/getLiteral';
import getPercentOfNumber from '@/helpers/getPercentOfNumber';
import SliderSettings from '@/models/SliderSetting';
import ThumbID from '@/models/ThumbID';
import { Subject } from '@/observer/Observer';

import Tip from './Tip';

class Thumb {
  parent: HTMLElement | null;
  thumbID: string;
  moveEvent: Subject;
  state: SliderSettings | null;
  element: HTMLElement;
  tip: Tip;

  constructor(thumbID: string, thumbMoved: Subject) {
    this.parent = null;
    this.thumbID = thumbID;
    this.moveEvent = thumbMoved;
    this.state = null;
    this.element = createElement('div', {
      class: 'slider__thumb',
    });
    this.tip = new Tip();
  }

  getPercentPerMark() {
    if (!this.parent) return 0;

    const { isVertical, maxIndex } = this.state;

    const thumb = this.element.getBoundingClientRect();
    const track = this.parent.getBoundingClientRect();
    const size = getSizeLiteral(isVertical);

    const pxPerMark = (track[size] - thumb[size]) / maxIndex;
    const movePercent = getPercentOfNumber(pxPerMark, track[size]);

    return movePercent;
  }

  render(parent: HTMLElement, state: SliderSettings) {
    this.parent = parent;
    this.state = state;

    const { isRange, isVertical } = this.state;

    this.element.addEventListener('pointerdown', this.handleDragThumb);
    this.element.addEventListener('dragstart', this.handleDragStart);

    this.show(isRange);
    this.move(this.state[`${this.thumbID}Index`], isVertical);
  }

  move(valueIndex: number, isVertical: boolean) {
    if (!this.element.isConnected || !this.parent) return;

    const movePercent = this.getPercentPerMark() * valueIndex;

    if (isVertical) {
      this.element.style.top = `${movePercent}%`;
      this.element.style.left = '0';
    } else {
      this.element.style.left = `${movePercent}%`;
      this.element.style.top = '0';
    }
  }

  show(isRange: boolean) {
    if (!this.parent) return;

    if (!isRange && this.thumbID === ThumbID.to) {
      this.element.remove();
    } else {
      this.parent.append(this.element);
    }
  }

  renderTip(value: number, showTip: boolean) {
    this.tip.render({ parent: this.element, value, showTip });
  }

  private handleDragStart() {
    return false;
  }

  private handleDragThumb = (pointerDown: PointerEvent) => {
    pointerDown.preventDefault();

    const shiftX = pointerDown.clientX - this.element.offsetLeft;
    const shiftY = pointerDown.clientY - this.element.offsetTop;

    const handlePointerMove = (pointerMove: PointerEvent) => {
      if (!this.parent) return;

      const { isVertical, maxIndex, values } = this.state;

      const offsetX = pointerMove.clientX - shiftX;
      const offsetY = pointerMove.clientY - shiftY;
      let offsetPx = isVertical ? offsetY : offsetX;

      if (offsetPx < 0) offsetPx = 0;

      const size = getSizeLiteral(isVertical);
      const parentSize = this.parent.getBoundingClientRect()[size];

      const offsetPercent = getPercentOfNumber(offsetPx, parentSize);
      let valueIndex = Math.round(offsetPercent / this.getPercentPerMark());

      if (valueIndex > maxIndex) valueIndex = maxIndex;

      const value = values[valueIndex];

      if (this.thumbID === ThumbID.from) {
        this.moveEvent.notify({ from: value });
      } else if (this.thumbID === ThumbID.to) {
        this.moveEvent.notify({ to: value });
      }
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
