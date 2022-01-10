const sliderErrors = {
  throwContainerNotFound: () => {
    console.log(`Slider container not found`);
  },
  throwOptionNotValid: (option: number) => {
    console.log(`${option} isn't a valid option`);
  },
  throwOptionOutOfRange: (option: string, min: number, max: number) => {
    console.log(`${option} option out of range [${min}:${max}]`);
  },
  throwMinimumOptionsRequired: () => {
    console.log(`Options: min, max and from are required`);
  },
};

export default sliderErrors;
