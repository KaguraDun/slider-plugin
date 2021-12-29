import createElement from '@/helpers/createElement';

function createInputs({ container, items, type }) {
  const inputsContainer = createElement('div', {
    class: 'slider-controls__inputs-container',
  });

  const inputs = {};

  items.forEach(({ name, getValue }) => {
    const inputClasses = `slider-controls__input ${
      type === 'checkbox' ? 'slider-controls__input--checkbox' : ''
    }`;

    const input = createElement('input', {
      class: inputClasses,
      type: type,
      name: name,
      ...(type === 'checkbox' && getValue() && { checked: 'checked' }),
      ...(type === 'number' && { value: getValue() }),
    });

    const labelText = createElement(
      'span',
      {
        class: 'slider-controls__input-label-text',
      },
      [name],
    );

    const label = createElement(
      'label',
      {
        class: 'slider-controls__input-label',
      },
      [labelText, input],
    );

    const inputContainer = createElement(
      'div',
      {
        class: 'slider-controls__input-container',
      },
      [label],
    );

    inputs[name] = {
      element: input,
    };

    inputsContainer.append(inputContainer);
  });

  const handleInputChange = ({ target }) => {
    const { handler } = items.filter(({ name }) => name === target.name)[0];

    if (target.type === 'checkbox') handler(target.checked);
    if (target.type === 'number') handler(target.value);
  };

  inputsContainer.addEventListener('change', handleInputChange);
  container.append(inputsContainer);

  return inputs;
}

function createSliderControls({ container, $slider }) {
  const numberItems = [
    {
      name: 'min',
      handler: $slider.setMin,
      getValue: $slider.getMin,
    },
    { name: 'max', handler: $slider.setMax, getValue: $slider.getMax },
    { name: 'step', handler: $slider.setStep, getValue: $slider.getStep },
    { name: 'from', handler: $slider.setFrom, getValue: $slider.getFrom },
    { name: 'to', handler: $slider.setTo, getValue: $slider.getTo },
  ];

  const booleanItems = [
    {
      name: 'vertical',
      handler: $slider.setIsVertical,
      getValue: $slider.getIsVertical,
    },
    {
      name: 'range',
      handler: $slider.setIsRange,
      getValue: $slider.getIsRange,
    },
    {
      name: 'scale',
      handler: $slider.setShowScale,
      getValue: $slider.getShowScale,
    },
    { name: 'bar', handler: $slider.setShowBar, getValue: $slider.getShowBar },
    { name: 'tip', handler: $slider.setShowTip, getValue: $slider.getShowTip },
  ];

  const numberInputs = createInputs({
    container,
    items: numberItems,
    type: 'number',
  });

  const booleanInputs = createInputs({
    container,
    items: booleanItems,
    type: 'checkbox',
  });

  const isRangeDefault = booleanInputs.range.element.checked;
  numberInputs.to.element.disabled = !isRangeDefault;

  const handleIsRangeChange = ({ target }) => {
    const isRange = target.checked;

    numberInputs.to.element.disabled = !isRange;
  };

  booleanInputs.range.element.addEventListener('change', handleIsRangeChange);
}

export default createSliderControls;
