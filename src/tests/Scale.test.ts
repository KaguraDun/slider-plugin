import { fireEvent } from '@testing-library/dom';

import SliderState from '@/models/SliderState';
import Scale from '@/views/Scale';

describe('Scale', () => {
  let scale: Scale | null = null;

  let mockState: SliderState = {
    fromIndex: 0,
    min: -5,
    max: 5,
    maxIndex: 10,
    step: 1,
    toIndex: undefined,
    values: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
    showBar: false,
    showScale: true,
    showTip: false,
    isRange: false,
    isVertical: false,
  };

  const observerEventsMock: any = {
    scaleMarkClicked: {
      notify: jest.fn((id: number) => id),
    },
  };

  const thumbRect: DOMRect = {
    ...document.createElement('div').getBoundingClientRect(),
    ...{
      height: 40,
      width: 15,
    },
  };

  const sliderRect: DOMRect = {
    ...document.createElement('div').getBoundingClientRect(),
    ...{
      height: 20,
      width: 280,
    },
  };

  beforeEach(() => {
    const slider = document.createElement('div');
    slider.getBoundingClientRect = jest.fn(() => sliderRect);

    document.body.append(slider);

    scale = new Scale(slider, observerEventsMock);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render', () => {
    scale?.render({
      state: mockState,
      percentPerMark: 6.309,
      thumbRect,
    });

    expect(scale?.element).toBeInTheDocument();
  });

  it('should not render', () => {
    const newMockState = { ...mockState, showScale: false };

    scale?.render({

      state: newMockState,
      percentPerMark: 6.309,
      thumbRect,
    });

    expect(scale?.element).not.toBeInTheDocument();
  });

  it('should handle scale clicks', () => {
    scale?.render({
      state: mockState,
      percentPerMark: 6.309,
      thumbRect,
    });

    fireEvent.click(scale!.element.childNodes[0]);
    expect(observerEventsMock.scaleMarkClicked.notify).toHaveBeenLastCalledWith({ from: -5 });

    fireEvent.click(scale!.element.childNodes[5]);
    expect(observerEventsMock.scaleMarkClicked.notify).toHaveBeenLastCalledWith({ from: 0 });

    fireEvent.click(scale!.element.childNodes[10]);
    expect(observerEventsMock.scaleMarkClicked.notify).toHaveBeenLastCalledWith({ from: 5 });
  });

  it('should choose first thumb as closest', () => {
    const newMockState = { ...mockState, isRange: true, toIndex: 10 };

    scale?.render({
      state: newMockState,
      percentPerMark: 6.309,
      thumbRect,
    });

    fireEvent.click(scale!.element.childNodes[1]);
    expect(observerEventsMock.scaleMarkClicked.notify).toHaveBeenCalledWith({
      from: -4
    });
  });

  it('should choose second thumb as closest', () => {
    const newMockState = { ...mockState, isRange: true, fromIndex: 1, toIndex: 10 };

    scale?.render({ 
      state: newMockState,
      percentPerMark: 6.309,
      thumbRect,
    });

    fireEvent.click(scale!.element.childNodes[9]);
    expect(observerEventsMock.scaleMarkClicked.notify).toHaveBeenCalledWith({
      to: 4
    });
  });

  it('should choose second thumb as closest', () => {
    const newMockState = { ...mockState, isRange: true, fromIndex: 1, toIndex: 9 };

    scale?.render({
      state: newMockState,
      percentPerMark: 6.309,
      thumbRect,
    });

    fireEvent.click(scale!.element.childNodes[5]);
    expect(observerEventsMock.scaleMarkClicked.notify).toHaveBeenCalledWith({
      to: 0
    });
  });
});
