import SliderSettings from '@/models/SliderSetting';
import SliderMethods from '@/ts/SliderMethods';

declare global {
  interface JQuery {
    createSlider: (options: SliderSettings) => SliderMethods;
  }
}
