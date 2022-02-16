import SliderSettings from '@/models/SliderSetting';
import SliderState from '@/models/SliderState';

import { ObserverSubject } from './ObserverSubject';

type StateChanged = ObserverSubject<SliderState>;
type ThumbMoved = ObserverSubject<Partial<SliderSettings>>;
type ScaleMarkClicked = ObserverSubject<Partial<SliderSettings>>;
type FromChanged = ObserverSubject<Pick<SliderSettings, 'from'>>;
type ToChanged = ObserverSubject<Pick<SliderSettings, 'to'>>;

class ObserverEvents {
  stateChanged: StateChanged;
  thumbMoved: ThumbMoved;
  scaleMarkClicked: ScaleMarkClicked;
  fromChanged: FromChanged;
  toChanged: ToChanged;

  constructor() {
    this.stateChanged = new ObserverSubject();
    this.thumbMoved = new ObserverSubject();
    this.scaleMarkClicked = new ObserverSubject();
    this.fromChanged = new ObserverSubject();
    this.toChanged = new ObserverSubject();
  }
}

export { ObserverEvents };
export type {
  FromChanged,
  ScaleMarkClicked,
  StateChanged,
  ThumbMoved,
  ToChanged,
};
