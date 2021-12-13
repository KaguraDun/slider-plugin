import createElement from '@/helpers/createElement';

function createInputs({ container, items, type }) {
  const inputsContainer = createElement('div', {
    class: 'slider-controls__inputs-container',
  });

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

    inputsContainer.append(inputContainer);
  });

  const handleInputChange = ({ target }) => {
    const { handler } = items.filter(({ name }) => name === target.name)[0];

    if (target.type === 'checkbox') handler(target.checked);
    if (target.type === 'number') handler(target.value);
  };

  inputsContainer.addEventListener('change', handleInputChange);

  container.append(inputsContainer);
}

function createSliderControls({ container, $instance }) {
  const numberInputs = [
    // { name: 'min', handler: $instance.setMin, getValue: $instance.getMin },
    // { name: 'max', handler: $instance.setMax, getValue: $instance.getMax },
    // { name: 'step', handler: $instance.setStep, getValue: $instance.getStep },
    { name: 'from', handler: $instance.setFrom, getValue: $instance.getFrom },
    // { name: 'to', handler: $instance.setTo, getValue: $instance.getTo },
  ];

  const booleanInputs = [
    // {
    //   name: 'vertical',
    //   handler: $instance.setIsVertical,
    //   getValue: $instance.getIsVertical,
    // },
    // {
    //   name: 'range',
    //   handler: $instance.setIsRange,
    //   getValue: $instance.getIsRange,
    // },
    // {
    //   name: 'scale',
    //   handler: $instance.showScale,
    //   getValue: $instance.getShowScale,
    // },
    // { name: 'bar', handler: $instance.showBar, getValue: $instance.getShowBar },
    // { name: 'tip', handler: $instance.showTip, getValue: $instance.getShowTip },
  ];

  createInputs({
    container,
    items: numberInputs,
    type: 'number',
  });
  createInputs({
    container,
    items: booleanInputs,
    type: 'checkbox',
  });
}

export default createSliderControls;
