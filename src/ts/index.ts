import '../styles/index.scss';

import createElement from '../helpers/createElement';
import Presenter from '../presenters/Presenter';
import Model from '../models/Model';
import View from '../views/View';

const container = createElement('div', 'container');
document.body.append(container);

const app = new Presenter(new Model(), new View());
app.init();
