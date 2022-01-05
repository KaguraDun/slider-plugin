import ThumbID from './ThumbID';

interface OptionOutOfRange {
  option: ThumbID;
  min: number | undefined;
  max: number | undefined;
}

const sliderErrors = {
  throwContainerNotFound: () => {
    console.log(`Slider container not found`);
  },
  throwOptionNotValid: (option: number) => {
    console.log(`${option} isn't a valid option`);
  },
  throwOptionOutOfRange: ({ option, min, max }: OptionOutOfRange) => {
    console.log(`${option} option out of range [${min}:${max}]`);
  },
  throwMinimumOptionsRequired: () => {
    console.log(`Options: min, max and from are required`);
  },
};

export default sliderErrors;
