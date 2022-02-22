import SliderMethods from '@/ts/SliderMethods';

import { getPanelItems, PanelItems, TypeLiterals } from './get-panel-items';
import './slider-panel.scss';

interface SliderPanelProps {
  $slider: SliderMethods;
  container: Element;
}

interface InputChangeHandler {
  handler(value: number | boolean): void;
}

interface ChangedRange {
  min?: number;
  max?: number;
}

class SliderPanel {
  readonly container: Element;
  private $slider: SliderMethods;
  private panelItems: PanelItems;
  private inputList: Record<string, HTMLInputElement>;

  constructor({ container, $slider }: SliderPanelProps) {
    this.container = container;
    this.$slider = $slider;
    this.panelItems = getPanelItems($slider);
    this.inputList = {};
  }

  attachEvents() {
    if (!this.container) return;

    this.inputList = { ...this.getInputList() };

    this.setInputValues();
    this.setDefaultRangeParameters();

    this.container.addEventListener('change', this.handleInputChange);

    this.$slider.fromChangedEvent(this.updateFrom);
    this.$slider.toChangedEvent(this.updateTo);

    this.inputList.min.addEventListener('change', this.handleMinChange);
    this.inputList.step.addEventListener('change', this.handleStepChange);
    this.inputList.range.addEventListener('change', this.handleIsRangeChange);
  }

  private getInputList() {
    const inputs: Record<string, HTMLInputElement> = {};

    Array.from(this.container.children).forEach((element) => {
      const input: HTMLInputElement | null = element.querySelector(
        '.js-slider-panel-input',
      );
      const name = input?.name;

      if (name) {
        inputs[name] = input;
      }
    });

    return inputs;
  }

  private setInputValues() {
    Object.values(this.inputList).forEach((input) => {
      const name = input.name;
      const value = this.panelItems[name].getValue();

      const isCheckbox = input.type === TypeLiterals.checkbox;
      const shouldChecked = isCheckbox && value === true;

      if (shouldChecked) {
        input.checked = true;
        return;
      }

      input.value = String(value);
    });
  }

  private setDefaultRangeParameters() {
    const min = String(this.$slider.getMin());
    const step = String(this.$slider.getStep());
    const isRange = this.$slider.getIsRange();

    this.inputList.to.disabled = !isRange;

    this.inputList.from.min = min;
    this.inputList.to.min = min;

    this.inputList.from.step = step;
    this.inputList.to.step = step;
  }

  private handleInputChange = (changeEvent: Event) => {
    const target = changeEvent.target as HTMLInputElement;

    if (!target) return;

    const { handler }: InputChangeHandler = Object.values(
      this.panelItems,
    ).filter(({ name }) => name === target.name)[0];

    if (target.type === TypeLiterals.checkbox) {
      handler(target.checked);
      return;
    }

    let value = this.validateNumberInputs(target.name, Number(target.value));
    target.value = String(value);

    handler(value);
  };

  private updateStep(changedRange: ChangedRange) {
    const step = Number(this.inputList.step.value);
    const validatedStep = String(this.validateStep(step, changedRange));

    if (validatedStep !== String(step)) {
      this.inputList.step.value = validatedStep;

      const { handler }: InputChangeHandler = this.panelItems.step;
      handler(Number(validatedStep));
    }
  }

  private validateNumberInputs(name: string, value: number) {
    if (name === 'min') {
      const validatedMin = this.validateMin(value);
      this.updateStep({ min: validatedMin });

      return validatedMin;
    }

    if (name === 'max') {
      const validatedMax = this.validateMax(value);
      this.updateStep({ max: validatedMax });

      return validatedMax;
    }

    if (name === 'step') {
      return this.validateStep(value);
    }

    if (name === 'from') {
      return this.validateFrom(value);
    }

    if (name === 'to') {
      return this.validateTo(value);
    }

    return 0;
  }

  private validateMin(value: number) {
    const max = this.$slider.getMax() - 1;
    if (value >= max) return max;

    return value;
  }

  private validateMax(value: number) {
    const min = this.$slider.getMin() + 1;
    if (value <= min) return min;
    return value;
  }

  private validateStep(value: number, changedRange?: ChangedRange) {
    const min = changedRange?.min || this.$slider.getMin();
    const max = changedRange?.max || this.$slider.getMax();
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

    const aboveTo = isRange && value > to;

    if (aboveTo) return to;
    if (value < min) return min;
    if (value > max) return max;

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
    const target = changeEvent.target as HTMLInputElement;
    const isRange = target.checked;

    this.inputList.to.disabled = !isRange;
  };

  private handleMinChange = (changeEvent: Event) => {
    const target = changeEvent.target as HTMLInputElement;

    this.inputList.from.min = target.value;
    this.inputList.to.min = target.value;
  };

  private handleStepChange = (changeEvent: Event) => {
    const target = changeEvent.target as HTMLInputElement;

    this.inputList.from.step = target.value;
    this.inputList.to.step = target.value;
  };

  private updateFrom = () => {
    this.inputList.from.value = String(this.$slider.getFrom());
  };

  private updateTo = () => {
    this.inputList.to.value = String(this.$slider.getTo());
  };
}

export default SliderPanel;
