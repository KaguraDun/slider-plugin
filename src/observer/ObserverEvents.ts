import { Subject } from './Observer';

class ObserverEvents {
  stateChanged: Subject;
  thumbMoved: Subject;

  constructor() {
    this.stateChanged = new Subject();
    this.thumbMoved = new Subject();
  }
}

export { ObserverEvents };
