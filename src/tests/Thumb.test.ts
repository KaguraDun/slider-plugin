import { fireEvent } from '@testing-library/dom';

import SliderState from '@/models/SliderState';
import ThumbID from '@/models/ThumbID';
import Thumb from '@/views/Thumb';
import { ObserverEvents } from '@/observer/ObserverEvents';

describe('Thumb', () => {
  let firstThumb: Thumb;
  let secondThumb: Thumb;
  let track: HTMLElement;

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

  const observerEventsMock = { 
    thumbMoved: {
      notify: jest.fn((thumb: { thumb: number } ) => thumb),
    },  
  };

  beforeEach(() => {
    track = document.createElement('div');
    document.body.append(track);

    firstThumb = new Thumb({
      parent: track,
      thumbID: ThumbID.from,
      observerEvents: observerEventsMock as unknown as ObserverEvents,
    });

    secondThumb = new Thumb({
      parent: track,
      thumbID: ThumbID.to,
      observerEvents: observerEventsMock as unknown as ObserverEvents,
    });

    const thumbRect: DOMRect = {
      ...track.getBoundingClientRect(),
      ...{
        offsetLeft: 0,
        offsetTop: 0,
        height: 40,
        width: 15,
      },
    };

    const trackRect: DOMRect = {
      ...track.getBoundingClientRect(),
      ...{
        offsetLeft: 0,
        offsetTop: 0,
        height: 20,
        width: 280,
      },
    };

    firstThumb.element.getBoundingClientRect = jest.fn(() => thumbRect);
    secondThumb.element.getBoundingClientRect = jest.fn(() => thumbRect);
    track.getBoundingClientRect = jest.fn(() => trackRect);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render first thumb', () => {
    firstThumb.init();
    firstThumb.show(true);
    expect(firstThumb.element).toBeInTheDocument();
  });

  it('should render two thumb when isRange = true', () => {
    const newMockState = { isRange: true };

    firstThumb.init();
    secondThumb.init();
    firstThumb.show(true);
    secondThumb.show(newMockState.isRange);

    expect(firstThumb.element).toBeInTheDocument();
    expect(secondThumb.element).toBeInTheDocument();
  });

  it('should get percent per mark', () => {
    const { isVertical, maxIndex } = mockState;

    firstThumb.init();
    firstThumb.show(true);

    const percentPerMark = Number(
      firstThumb.getPercentPerMark({ isVertical, maxIndex }).toFixed(2),
    );

    expect(percentPerMark).toBeCloseTo(9.46);
  });

  it('should handle first thumb drag', () => {
    const { fromIndex, values, isVertical, maxIndex } = mockState;

    firstThumb.init();
    firstThumb.show(true);
    firstThumb.move({ valueIndex: fromIndex, isVertical, maxIndex, values });

    fireEvent.pointerDown(firstThumb.element);
    fireEvent.pointerMove(firstThumb.element);
    fireEvent.pointerUp(firstThumb.element);

    expect(observerEventsMock.thumbMoved.notify).toBeCalled();
  });

  it('should handle second thumb drag', () => {
    const newMockState = { ...mockState, isRange: true, toIndex: 10 };
    const { fromIndex, toIndex, maxIndex, isVertical, values } = newMockState;
    firstThumb.init();
    secondThumb.init();

    firstThumb.show(true);
    secondThumb.show(newMockState.isRange);

    firstThumb.move({ valueIndex: fromIndex, isVertical, maxIndex, values });
    secondThumb.move({ valueIndex: toIndex, isVertical, maxIndex, values });

    fireEvent.pointerDown(secondThumb.element);
    fireEvent.pointerMove(secondThumb.element);
    fireEvent.pointerUp(secondThumb.element);

    expect(observerEventsMock.thumbMoved.notify).toBeCalled();
  });

  it('should move thumb when isVertical = false', () => {
    const newMockState = { ...mockState, fromIndex: 5 };
    const { fromIndex, maxIndex, isVertical, values } = newMockState;

    firstThumb.init();
    firstThumb.show(true);
    firstThumb.move({ valueIndex: fromIndex, isVertical, maxIndex, values });

    const firstThumbLeft = Number.parseInt(firstThumb.element.style.left, 10);
    expect(firstThumbLeft).toEqual(47);
  });

  it('should move thumb when isVertical = true', () => {
    const newMockState = { ...mockState, fromIndex: 5, isVertical: true };
    const { fromIndex, maxIndex, isVertical, values } = newMockState;

    const firstThumbRectVertical: DOMRect = {
      ...track.getBoundingClientRect(),
      ...{
        height: 15,
        width: 40,
      },
    };

    const trackRectVertical: DOMRect = {
      ...track.getBoundingClientRect(),
      ...{
        height: 280,
        width: 20,
      },
    };

    firstThumb.element.getBoundingClientRect = jest.fn().mockImplementationOnce(
      () => firstThumbRectVertical,
    );

    track.getBoundingClientRect = jest.fn().mockImplementationOnce(() => trackRectVertical);

    firstThumb.init();
    firstThumb.show(true);
    firstThumb.move({ valueIndex: fromIndex, isVertical, maxIndex, values });

    const firstThumbTop = Number.parseInt(firstThumb.element.style.top, 10);
    expect(firstThumbTop).toEqual(47);
  });

  it('should set top thumb', ()=>{
    const newMockState = { isRange: true };

    firstThumb.init();
    secondThumb.init();
    firstThumb.show(true);
    secondThumb.show(newMockState.isRange);

    firstThumb.toggleTopElement(true);

    expect(firstThumb.element.classList).toContain('slider__thumb_top');
    expect(secondThumb.element.classList).not.toContain('slider__thumb_top');

  })
});
