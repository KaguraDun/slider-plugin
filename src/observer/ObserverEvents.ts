import SliderSettings from '@/models/SliderSetting';
import SliderState from '@/models/SliderState';

import { Subject } from './Observer';

class ObserverEvents {
  stateChanged: Subject<SliderState>;
  thumbMoved: Subject<SliderSettings>;
  scaleClick: Subject<SliderSettings>;
  fromChanged: Subject<SliderSettings>;
  toChanged: Subject<SliderSettings>;

  constructor() {
    this.stateChanged = new Subject();
    this.thumbMoved = new Subject();
    this.scaleClick = new Subject();
    this.fromChanged = new Subject();
    this.toChanged = new Subject();
  }
}

export { ObserverEvents };
