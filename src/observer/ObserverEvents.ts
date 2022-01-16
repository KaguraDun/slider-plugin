import SliderSettings from '@/models/SliderSetting';
import SliderState from '@/models/SliderState';

import { ObserverSubject } from './ObserverSubject';

type StateChanged = ObserverSubject<SliderState>;
type ThumbMoved = ObserverSubject<Partial<SliderSettings>>;
type ScaleClick = ObserverSubject<Partial<SliderSettings>>;
type FromChanged = ObserverSubject<Pick<SliderSettings, 'from'>>;
type ToChanged = ObserverSubject<Pick<SliderSettings, 'to'>>;

class ObserverEvents {
  stateChanged: StateChanged;
  thumbMoved: ThumbMoved;
  scaleClick: ScaleClick;
  fromChanged: FromChanged;
  toChanged: ToChanged;

  constructor() {
    this.stateChanged = new ObserverSubject();
    this.thumbMoved = new ObserverSubject();
    this.scaleClick = new ObserverSubject();
    this.fromChanged = new ObserverSubject();
    this.toChanged = new ObserverSubject();
  }
}

export { ObserverEvents };
export type { FromChanged, ScaleClick, StateChanged, ThumbMoved, ToChanged };
