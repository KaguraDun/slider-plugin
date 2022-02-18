import Track from '@/views/Track';
import { fireEvent } from '@testing-library/dom';
import { ObserverEvents } from '@/observer/ObserverEvents';

describe('Track', () => {
  let track: Track;
  const observerEventsMock = {
    trackClicked: {
      notify: jest.fn((index: number) => index),
    },
  };

  beforeEach(() => {
    track = new Track(document.body, observerEventsMock as unknown as ObserverEvents);

    const trackRect: DOMRect = {
      ...track.element.getBoundingClientRect(),
      ...{
        left: 0,
        top: 0,
        height: 40,
        width: 200,
      },
    };

    track.element.getBoundingClientRect = jest.fn(() => trackRect);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render', () => {
    track.render();

    expect(track.element).toBeInTheDocument();
  });

  it('should handle clicks', () => {
    track.render();

    track.setClickEventArguments({ isVertical: false, maxIndex: 100 });
    fireEvent.click(track.element, { clientX: 10, clientY: 0 });

    expect(observerEventsMock.trackClicked.notify).toHaveBeenLastCalledWith(5);

    fireEvent.click(track.element, { clientX: 45, clientY: 0 });
    expect(observerEventsMock.trackClicked.notify).toHaveBeenLastCalledWith(23);

    fireEvent.click(track.element, { clientX: 200, clientY: 0 });
    expect(observerEventsMock.trackClicked.notify).toHaveBeenLastCalledWith(
      100,
    );
  });
});
