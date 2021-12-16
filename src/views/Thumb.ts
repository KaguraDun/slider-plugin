import createElement from '@/helpers/createElement';
import SliderSettings from '@/models/SliderSetting';
import Tip from './Tip';
import { Subject } from '@/observer/Observer';
import ThumbID from '@/models/ThumbID';

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
      class: 'slider-thumb',
    });
    this.tip = new Tip();
  }

  getPXPerMark() {
    const thumbWidth = this.element.getBoundingClientRect().width;
    const track = this.parent.getBoundingClientRect();
    const trackWidth = this.state.isVertical ? track.height : track.width;
    const PXperMark = (trackWidth - thumbWidth) / this.state.maxIndex;

    return PXperMark;
  }

  handleDragThumb = (e: MouseEvent) => {
    e.preventDefault();
    const shiftX = e.clientX - this.element.offsetLeft;
    const shiftY = e.clientY - this.element.offsetLeft;

    const handleMouseMove = (mouseMove: MouseEvent) => {
      const offsetX = mouseMove.clientX - shiftX;
      const offsetY = mouseMove.clientY - shiftY;
      let offset = this.state?.isVertical ? offsetY : offsetX;

      if (offset < 0) offset = 0;

      let valueIndex = Math.round(offset / this.getPXPerMark());

      if (valueIndex > this.state?.maxIndex) valueIndex = this.state?.maxIndex;

      const value = this.state?.values[valueIndex];

      if (this.thumbID === ThumbID.from) {
        this.moveEvent.notify({ from: value });
      } else if (this.thumbID === ThumbID.to) {
        this.moveEvent.notify({ to: value });
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  render(parent: HTMLElement, state: SliderSettings) {
    this.parent = parent;
    this.state = state;

    this.element.addEventListener('mousedown', this.handleDragThumb);
    this.element.addEventListener('dragstart', () => false);

    this.move(this.state[`${this.thumbID}Index`]);
    this.show(this.state?.isRange);
  }

  move(valueIndex: number) {
    const movePX = this.getPXPerMark() * valueIndex;

    this.element.style.left = `${movePX}px`;
  }

  show(isRange: boolean) {
    if (!isRange && this.thumbID === 'to') {
      this.element.remove();
    } else {
      this.parent.append(this.element);
    }
  }

  renderTip(value: number, isVertical: boolean, showTip: boolean) {
    this.tip.render({ parent: this.element, value, isVertical, showTip });
  }
}

export default Thumb;
