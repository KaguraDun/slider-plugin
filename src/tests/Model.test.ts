import Model from '@/models/Model';
import SliderState from '@/models/SliderState';
import { ObserverEvents } from '@/observer/ObserverEvents';

interface ObserverEventsMock {
  stateChanged: {
    notify: jest.Mock;
  };
  fromChanged: {
    notify: jest.Mock;
  };
  toChanged: {
    notify: jest.Mock;
  };
}

describe('Model', () => {
  let model: Model;
  let observerEventsMock: ObserverEventsMock;

  beforeEach(() => {
    window.console.log = jest.fn();

    observerEventsMock = {
      stateChanged: {
        notify: jest.fn((state: SliderState) => state),
      },
      fromChanged: {
        notify: jest.fn((from: number) => from),
      },
      toChanged: {
        notify: jest.fn((to: number) => to),
      },
    };

    model = new Model(observerEventsMock as unknown as ObserverEvents);
    model.setOptions({
      min: -10,
      max: 10,
      from: 0,
    });
  });

  it('should set to', () => {
    model.setOptions({
      min: -10,
      max: 10,
      from: 0,
      to: 5,
      isRange: true,
    });

    expect(model.getTo()).toEqual(5);
  });

  it('should validate and adjust step', () => {
    model.setStep(-10);
    expect(model.getStep()).toEqual(1);
  });

  it('should set to with max value if to is undefined', () => {
    expect(model.getTo()).toEqual(model.getMax());
  });

  it('should set from', () => {
    model.setFrom(5);
    expect(model.getFrom()).toEqual(5);
  });

  it('should set to as maxIndex if to > maxIndex', () => {
    model.setTo(100);

    expect(model.getTo()).toEqual(10);
  });

  it('should equalize from and to if from > to', () => {
    model.setIsRange(true);
    model.setTo(5);
    model.setFrom(10);

    expect(model.getFrom()).toEqual(5);
  });

  it('should equalize to and from if to < from', () => {
    model.setIsRange(true);
    model.setTo(-10);

    expect(model.getTo()).toEqual(0);
  });

  it('should update from and to when min changed', () => {
    model.setIsRange(true);
    model.setTo(10);
    model.setMin(-15);

    expect(model.getFrom()).toEqual(-5);
    expect(model.getTo()).toEqual(5);
  });

  it('should set from thumb by object pass', () => {
    model.setThumb({ from: 10 });
    expect(model.getFrom()).toEqual(10);
  });

  it('should set to thumb by object pass', () => {
    model.setThumb({ to: 10 });
    expect(model.getTo()).toEqual(10);
  });

  it('show error message in console when from < min', () => {
    model.setFrom(-15);
    expect(window.console.log).toBeCalled();
  });

  it('show error message in console when from > max', () => {
    model.setFrom(15);
    expect(window.console.log).toBeCalled();
  });

  it('show error message in console when to < min', () => {
    model.setTo(-15);
    expect(window.console.log).toBeCalled();
  });

  it('show error message in console when to > max', () => {
    model.setTo(15);
    expect(window.console.log).toBeCalled();
  });

  it('should set from thumb', () => {
    model.setThumb({ from: -5 });
    expect(model.getFrom()).toEqual(-5);
  });

  it('should set to thumb', () => {
    model.setIsRange(true);
    model.setThumb({ to: 5 });

    expect(model.getTo()).toEqual(5);
  });

  it('should swap thumbs when from < to and isRange changed', () => {
    model.setTo(-10);
    model.setIsRange(true);

    expect(model.getTo()).toEqual(0);
    expect(model.getFrom()).toEqual(-10);
  });

  it('should set from thumb as closest to index when is range false', () => {
    model.setIndex(15);

    expect(model.getFrom()).toEqual(5);
  });

  it('should set to thumb as closest to index', () => {
    model.setIsRange(true);
    model.setTo(10);
    model.setIndex(15);

    expect(model.getTo()).toEqual(5);
    expect(model.getFrom()).toEqual(0);
  });

  it('should set from thumb as closest to index', () => {
    model.setIsRange(true);
    model.setTo(10);
    model.setIndex(5);

    expect(model.getFrom()).toEqual(-5);
    expect(model.getTo()).toEqual(10);
  });

  it('should not set any thumb if index out of range', () => {
    model.setIsRange(true);
    model.setTo(10);
    model.setIndex(50);

    expect(model.getFrom()).toEqual(0);
    expect(model.getTo()).toEqual(10);

    model.setIndex(-50);

    expect(model.getFrom()).toEqual(0);
    expect(model.getTo()).toEqual(10);
  });

  it('should validate step when max-min difference below step', () => {
    model.setMax(-9);
    model.setStep(5);

    expect(model.getStep()).toEqual(1);
  });

  it('should generate array of integer values', () => {
    model.setOptions({
      min: -50,
      max: 50,
      step: 10,
    });

    const values = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50];

    expect(model.getValues()).toEqual(values);
  });

  it('should generate array of float values', () => {
    model.setOptions({
      min: -1,
      max: 1,
      step: 0.25,
    });

    const values = [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1];

    expect(model.getValues()).toEqual(values);
  });

  it('should call event when from changed', () => {
    model.setFrom(10);
    expect(observerEventsMock.fromChanged.notify).toHaveBeenLastCalledWith({
      from: 10,
    });
  });

  it('should call event when to changed', () => {
    model.setIsRange(true);
    model.setTo(10);

    expect(observerEventsMock.toChanged.notify).toHaveBeenLastCalledWith({
      to: 10,
    });
  });

  it('should call event when state changed', () => {
    model.setFrom(10);
    expect(observerEventsMock.stateChanged.notify).toBeCalled();
  });
});
