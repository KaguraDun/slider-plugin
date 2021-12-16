import { Subject } from './Observer';

class ObserverEvents {
  stateChanged: Subject;
  thumbMoved: Subject;
  scaleClick: Subject;

  constructor() {
    this.stateChanged = new Subject();
    this.thumbMoved = new Subject();
    this.scaleClick = new Subject();
  }
}

export { ObserverEvents };
