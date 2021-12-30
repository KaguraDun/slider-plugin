import createElement from '@/helpers/createElement';

import { getPanelItems, TypeLiterals } from './getPanelItems';

import './SliderPanel.scss';

interface SliderPanelProps {
  $slider: any;
  container: HTMLElement;
}

interface CreateInputProps {
  name: string;
  type: TypeLiterals.number | TypeLiterals.checkbox;
  getValue: () => number | string;
}

class SliderPanel {
  $slider: any;
  container: HTMLElement;
  className: string;
  panelItems: any;
  inputList: Record<string, HTMLInputElement>;

  constructor({ $slider, container }: SliderPanelProps) {
    this.$slider = $slider;
    this.container = container;
    this.className = 'slider-panel';
    this.panelItems = getPanelItems($slider);
    this.inputList = {};
  }

  render() {
    const inputsContainer = createElement('div', {
      class: `${this.className}__inputs-container`,
    });

    Object.values(this.panelItems).forEach((item) => {
      const { name, type, getValue } = item;
      const input = this.createInput({ name, type, getValue });

      inputsContainer.append(input);
    });

    inputsContainer.addEventListener('change', this.handleInputChange);

    const isRange = this.$slider.getIsRange();
    this.inputList.to.disabled = !isRange;

    this.$slider.fromChangedEvent(this.updateFrom);
    this.$slider.toChangedEvent(this.updateTo);

    this.inputList.min.addEventListener('change', this.handleMinChange);

    //set min for correct step
    const min = this.$slider.getMin();
    this.inputList.from.min = min;
    this.inputList.to.min = min;

    this.inputList.step.addEventListener('change', this.handleStepChange);

    this.inputList.range.addEventListener('change', this.handleIsRangeChange);

    this.container.append(inputsContainer);
  }

  private createInput({ name, type, getValue }: CreateInputProps) {
    const inputClassNames = [`${this.className}__input`];

    if (type === TypeLiterals.checkbox)
      inputClassNames.push(`${this.className}__input_checkbox`);

    const isChecked = getValue() && { checked: 'checked' };
    const checkbox = type === TypeLiterals.checkbox && isChecked;
    const number = type === TypeLiterals.number && { value: getValue() };

    const input = createElement('input', {
      class: inputClassNames.join(' '),
      type,
      name,
      ...checkbox,
      ...number,
    });

    const labelText = createElement(
      'span',
      {
        class: `${this.className}__input-label-text`,
      },
      [name],
    );

    const label = createElement(
      'label',
      {
        class: `${this.className}__input-label`,
      },
      [labelText, input],
    );

    const inputContainer = createElement(
      'div',
      {
        class: `${this.className}__input-container`,
      },
      [label],
    );

    this.inputList[name] = input;

    return inputContainer;
  }

  private handleInputChange = (changeEvent: Event) => {
    const target = <HTMLInputElement>changeEvent.target;

    if (!target) return;

    const { handler } = Object.values(this.panelItems).filter(
      ({ name }) => name === target.name,
    )[0];

    if (target.type === TypeLiterals.checkbox) {
      handler(target.checked);
      return;
    }

    let value = Number(target.value);

    if (target.name === 'step') {
      value = this.validateStep(value);
      target.value = String(value);
    }

    if (target.name === 'from') {
      value = this.validateFrom(value);
      target.value = String(value);
    }

    if (target.name === 'to') {
      value = this.validateTo(value);
      target.value = String(value);
    }

    if (target.type === 'number') handler(value);
  };

  private validateStep(value: number) {
    const min = this.$slider.getMin();
    const max = this.$slider.getMax();
    const maxStep = Math.abs(max - min);
    const minStepValue = 1;

    if (value <= 0) return minStepValue;
    if (value > maxStep) return maxStep;

    return value;
  }

  private validateFrom(value: number) {
    const isRange = this.$slider.getIsRange();
    const to = this.$slider.getTo();
    const min = this.$slider.getMin();
    const max = this.$slider.getMax();

    if (value < min) return min;

    if (isRange) {
      if (value > to) return to;
    } else {
      if (value > max) return max;
    }

    return value;
  }

  private validateTo(value: number) {
    const from = this.$slider.getFrom();
    const max = this.$slider.getMax();

    if (value < from) return from;
    if (value > max) return max;

    return value;
  }

  private handleIsRangeChange = (changeEvent: Event) => {
    const target = <HTMLInputElement>changeEvent.target;
    const isRange = target.checked;

    this.inputList.to.disabled = !isRange;
  };

  private handleMinChange = (changeEvent: Event) => {
    const target = <HTMLInputElement>changeEvent.target;

    this.inputList.from.min = target.value;
    this.inputList.to.min = target.value;
  };

  private handleStepChange = (changeEvent: Event) => {
    const target = <HTMLInputElement>changeEvent.target;

    this.inputList.from.step = target.value;
    this.inputList.to.step = target.value;
  };

  private updateFrom = () => {
    this.inputList.from.value = this.$slider.getFrom();
  };

  private updateTo = () => {
    this.inputList.to.value = this.$slider.getTo();
  };
}

export default SliderPanel;
