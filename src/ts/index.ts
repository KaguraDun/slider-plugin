import '../styles/index.scss';

import createElement from '../helpers/createElement';
import Presenter from '../presenters/Presenter';
import Model from '../models/Model';
import View from '../views/View';

const container = createElement('div', 'container');
const inputsContainer = createElement('div', 'inputs-container');

document.body.append(container, inputsContainer);

const app = new Presenter(new Model(), new View());
app.render();

const numberInputs = ['min', 'max', 'step', 'from', 'to'];
const booleanInputs = ['vertical', 'range', 'scale', 'bar', 'tip'];

numberInputs.forEach((inputName) => {
  const inputContainer = createElement('div', 'input-container');

  const label = createElement('label', 'input-label') as HTMLLabelElement;
  label.htmlFor = inputName;
  label.innerText = inputName;

  const input = createElement('input', 'input') as HTMLInputElement;
  input.type = 'number';
  input.id = inputName;
  input.value = app.model[inputName];

  inputContainer.append(label, input);
  inputsContainer.append(inputContainer);
});

document.getElementById('min').addEventListener('change', (e) => {
  const target = e.target as HTMLInputElement;
  app.changeMin(Number(target.value));
});

document.getElementById('max').addEventListener('change', (e) => {
  const target = e.target as HTMLInputElement;
  app.changeMax(Number(target.value));
});

document.getElementById('step').addEventListener('change', (e) => {
  const target = e.target as HTMLInputElement;
  app.changeStep(Number(target.value));
});
