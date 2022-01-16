import createElement from '@/assets/helpers/createElement';

import './SliderContainer.scss';

enum OptionsClass {
  large = 'slider-example__slider-container_width_large',
}

enum OptionsList {
  large = 'large',
}

interface SliderContainerOptions {
  width: 'large';
}

class SliderContainer {
  heading: string;
  options: SliderContainerOptions | undefined;

  constructor(heading: string, options?: SliderContainerOptions) {
    this.heading = heading;
    this.options = options;
  }

  render() {
    const sliderPanelContainer = createElement('div', {
      class: 'slider-example__controls-container',
    });
    const sliderContainer = createElement('div', {
      class: `slider-example__slider-container ${
        this.options?.width === OptionsList.large
          ? OptionsClass[OptionsList.large]
          : ''
      }`,
    });
    const sliderSectionHeading = createElement(
      'div',
      { class: 'slider-example__heading' },
      [this.heading],
    );
    const sliderWrapper = createElement('div', { class: 'slider-example' }, [
      sliderSectionHeading,
      sliderContainer,
      sliderPanelContainer,
    ]);

    document.body.append(sliderWrapper);

    return { slider: sliderContainer, panel: sliderPanelContainer };
  }
}

export default SliderContainer;
