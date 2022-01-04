import SliderSettings from '@/models/SliderSetting';
import SliderState from '@/models/SliderState';

import { Subject } from './Observer';

type StateChanged = Subject<SliderState>;
type ThumbMoved = Subject<Partial<SliderSettings>>;
type ScaleClick = Subject<Partial<SliderSettings>>;
type FromChanged = Subject<Pick<SliderSettings, 'from'>>;
type ToChanged = Subject<Pick<SliderSettings, 'to'>>;

class ObserverEvents {
  stateChanged: StateChanged;
  thumbMoved: ThumbMoved;
  scaleClick: ScaleClick;
  fromChanged: FromChanged;
  toChanged: ToChanged;

  constructor() {
    this.stateChanged = new Subject();
    this.thumbMoved = new Subject();
    this.scaleClick = new Subject();
    this.fromChanged = new Subject();
    this.toChanged = new Subject();
  }
}

export { ObserverEvents };
export type { FromChanged, ScaleClick, StateChanged, ThumbMoved, ToChanged };
