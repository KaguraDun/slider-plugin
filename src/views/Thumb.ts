import createElement from '@/helpers/createElement';
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

  getPxPerMark() {
    if (!this.parent) return 0;

    const thumb = this.element.getBoundingClientRect();
    const track = this.parent.getBoundingClientRect();

    const thumbWidth = this.state.isVertical ? thumb.height : thumb.width;
    const trackWidth = this.state.isVertical ? track.height : track.width;

    const pxPerMark = (trackWidth - thumbWidth) / this.state.maxIndex;

    return pxPerMark;
  }

  render(parent: HTMLElement, state: SliderSettings) {
    this.parent = parent;
    this.state = state;

    this.element.addEventListener('pointerdown', this.handleDragThumb);
    this.element.addEventListener('dragstart', this.handleDragStart);

    this.show(this.state?.isRange);
    this.move(this.state[`${this.thumbID}Index`], this.state.isVertical);
  }

  move(valueIndex: number, isVertical: boolean) {
    const movePX = this.getPxPerMark() * valueIndex;

    if (isVertical) {
      this.element.style.top = `${movePX}px`;
      this.element.style.left = '0';
    } else {
      this.element.style.left = `${movePX}px`;
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

  private handleDragThumb = (mouseDown: MouseEvent) => {
    mouseDown.preventDefault();
    const shiftX = mouseDown.clientX - this.element.offsetLeft;
    const shiftY = mouseDown.clientY - this.element.offsetTop;

    const handleMouseMove = (mouseMove: MouseEvent) => {
      const offsetX = mouseMove.clientX - shiftX;
      const offsetY = mouseMove.clientY - shiftY;
      let offset = this.state?.isVertical ? offsetY : offsetX;

      if (offset < 0) offset = 0;

      let valueIndex = Math.round(offset / this.getPxPerMark());

      if (valueIndex > this.state?.maxIndex) valueIndex = this.state?.maxIndex;

      const value = this.state?.values[valueIndex];

      if (this.thumbID === ThumbID.from) {
        this.moveEvent.notify({ from: value });
      } else if (this.thumbID === ThumbID.to) {
        this.moveEvent.notify({ to: value });
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('pointermove', handleMouseMove);
      document.removeEventListener('pointerup', handleMouseUp);
    };

    document.addEventListener('pointermove', handleMouseMove);
    document.addEventListener('pointerup', handleMouseUp);
  };
}

export default Thumb;
