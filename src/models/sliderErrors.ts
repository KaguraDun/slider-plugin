const sliderErrors = {
  throwContainerNotFound: () => {
    console.log(`Slider container not found`);
  },
  throwOptionNotValid: (option: string) => {
    console.log(`${option} isn't a valid option`);
  },
};

export default sliderErrors;
