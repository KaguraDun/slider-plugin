import SliderSettings from '@/models/SliderSetting';
import SliderMethods from '@/types/SliderMethods';

declare global {
  interface JQuery {
    createSlider: (options: SliderSettings) => SliderMethods;
  }
}
