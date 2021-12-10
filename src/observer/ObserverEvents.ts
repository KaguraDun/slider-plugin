import { Subject } from './Observer';

class ObserverEvents {
  stateChanged: Subject;

  constructor() {
    this.stateChanged = new Subject();
  }
}

export { ObserverEvents };
