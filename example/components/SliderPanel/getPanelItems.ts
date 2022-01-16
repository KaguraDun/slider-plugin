import SliderMethods from '@/ts/SliderMethods';

enum TypeLiterals {
  number = 'number',
  checkbox = 'checkbox',
}

interface PanelItem {
  type: TypeLiterals;
  name: string;
  handler: ((value: number) => void) | ((value: boolean) => void);
  getValue: () => number | boolean;
}

type PanelItems = Record<string, PanelItem>;

function getPanelItems($slider: SliderMethods): PanelItems {
  return {
    min: {
      type: TypeLiterals.number,
      name: 'min',
      handler: $slider.setMin,
      getValue: $slider.getMin,
    },
    max: {
      type: TypeLiterals.number,
      name: 'max',
      handler: $slider.setMax,
      getValue: $slider.getMax,
    },
    step: {
      type: TypeLiterals.number,
      name: 'step',
      handler: $slider.setStep,
      getValue: $slider.getStep,
    },
    from: {
      type: TypeLiterals.number,
      name: 'from',
      handler: $slider.setFrom,
      getValue: $slider.getFrom,
    },
    to: {
      type: TypeLiterals.number,
      name: 'to',
      handler: $slider.setTo,
      getValue: $slider.getTo,
    },
    vertical: {
      type: TypeLiterals.checkbox,
      name: 'vertical',
      handler: $slider.setIsVertical,
      getValue: $slider.getIsVertical,
    },
    range: {
      type: TypeLiterals.checkbox,
      name: 'range',
      handler: $slider.setIsRange,
      getValue: $slider.getIsRange,
    },
    scale: {
      type: TypeLiterals.checkbox,
      name: 'scale',
      handler: $slider.setShowScale,
      getValue: $slider.getShowScale,
    },
    bar: {
      type: TypeLiterals.checkbox,
      name: 'bar',
      handler: $slider.setShowBar,
      getValue: $slider.getShowBar,
    },
    tip: {
      type: TypeLiterals.checkbox,
      name: 'tip',
      handler: $slider.setShowTip,
      getValue: $slider.getShowTip,
    },
  };
}

export { getPanelItems, TypeLiterals };
export type { PanelItem, PanelItems };
