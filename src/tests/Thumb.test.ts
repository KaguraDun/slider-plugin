import { fireEvent } from '@testing-library/dom';

import SliderState from '@/models/SliderState';
import ThumbID from '@/models/ThumbID';
import Thumb from '@/views/Thumb';

describe('Thumb', () => {
  let firstThumb: Thumb | null = null;
  let secondThumb: Thumb | null = null;
  let track: HTMLElement | null = null;

  let mockState: SliderState = {
    fromIndex: 0,
    min: -5,
    max: 5,
    maxIndex: 10,
    step: 1,
    toIndex: undefined,
    values: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
    showBar: false,
    showScale: false,
    showTip: false,
    isRange: false,
    isVertical: false,
  };

  let observerEventsMock: any = null;

  beforeEach(() => {
    observerEventsMock = {
      thumbMoved: {
        notify: jest.fn((thumb) => thumb),
      },
    };

    track = document.createElement('div'); 
    document.body.append(track);

    firstThumb = new Thumb({parent: track, thumbID: ThumbID.from, observerEvents: observerEventsMock});
    secondThumb = new Thumb({parent: track, thumbID: ThumbID.to, observerEvents: observerEventsMock});

    const firstThumbRect: DOMRect = {
      ...track!.getBoundingClientRect(),
      ...{
        height: 40,
        width: 15,
      },
    };

    const trackRect: DOMRect = {
      ...track!.getBoundingClientRect(),
      ...{
        height: 20,
        width: 280,
      },
    };

    firstThumb!.element.getBoundingClientRect = jest.fn(() => firstThumbRect);
    track!.getBoundingClientRect = jest.fn(() => trackRect);
  });

  it('should render first thumb', () => {
    firstThumb?.render(mockState);

    expect(firstThumb?.element).toBeInTheDocument();
  });

  it('should render two thumb when isRange = true', () => {
    const newMockState = { ...mockState, isRange: true, toIndex: 10 };

    firstThumb?.render(newMockState);
    secondThumb?.render(newMockState);

    expect(firstThumb?.element).toBeInTheDocument();
    expect(secondThumb?.element).toBeInTheDocument();
  });

  it('should get percent per mark', () => {
    firstThumb?.render(mockState);
    secondThumb?.render(mockState);

    const percentPerMark = Number(firstThumb?.getPercentPerMark().toFixed(2));

    expect(percentPerMark).toBeCloseTo(9.46);
  });

  it('should handle first thumb drag', () => {
    firstThumb?.render(mockState);

    fireEvent.pointerDown(firstThumb!.element);
    fireEvent.pointerMove(firstThumb!.element);

    expect(observerEventsMock!.thumbMoved.notify).toBeCalled();
  });

  it('should handle second thumb drag', () => {
    const newMockState = { ...mockState, isRange: true, toIndex: 10 };

    secondThumb?.render(newMockState);

    fireEvent.pointerDown(secondThumb!.element);
    fireEvent.pointerMove(secondThumb!.element, { clientX: 10, clientY: 10 });

    expect(observerEventsMock!.thumbMoved.notify).toBeCalled();
  });

  it('should move thumb when isVertical = false', () => {
    firstThumb?.render(mockState);
    firstThumb?.move(5, false);

    const firstThumbLeft = Number.parseInt(firstThumb!.element.style.left, 10);
    expect(firstThumbLeft).toEqual(47);
  });

  it('should move thumb when isVertical = true', () => {
    const newMockState = { ...mockState, isVertical: true };
    firstThumb?.render(newMockState);
    firstThumb?.move(5, true);

    const firstThumbRectVertical: DOMRect = {
      ...track!.getBoundingClientRect(),
      ...{
        height: 15,
        width: 40,
      },
    };

    const parentRectVertical: DOMRect = {
      ...track!.getBoundingClientRect(),
      ...{
        height: 280,
        width: 20,
      },
    };

    firstThumb!.element.getBoundingClientRect = jest.fn(
      () => firstThumbRectVertical,
    );

    track!.getBoundingClientRect = jest.fn(() => parentRectVertical);

    const firstThumbTop = Number.parseInt(firstThumb!.element.style.top, 10);
    expect(firstThumbTop).toEqual(47);
  });
});
