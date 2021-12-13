const sliderErrors = {
  throwContainerNotFound: () => {
    console.log(`Slider container not found`);
  },
  throwOptionNotValid: (option: string) => {
    console.log(`${option} isn't a valid option`);
  },
  throwOptionOutOfRange: (option: string, min: string, max: string) => {
    console.log(`${option} option out of range [${min}:${max}]`);
  },
};

export default sliderErrors;
