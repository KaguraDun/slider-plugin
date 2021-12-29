import { Subject } from './Observer';

class ObserverEvents {
  stateChanged: Subject;
  thumbMoved: Subject;
  scaleClick: Subject;
  fromChanged: Subject;
  toChanged: Subject;

  constructor() {
    this.stateChanged = new Subject();
    this.thumbMoved = new Subject();
    this.scaleClick = new Subject();
    this.fromChanged = new Subject();
    this.toChanged = new Subject();
  }
}

export { ObserverEvents };
