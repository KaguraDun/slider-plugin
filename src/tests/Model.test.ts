import Model from '@/models/Model';

describe('Model', () => {
  let model: Model;

  beforeEach(() => {
    const observerEventsMock: any = {
      stateChanged: {
        notify: jest.fn(() => true),
      },
      fromChanged: {
        notify: jest.fn(() => true),
      },
      toChanged: {
        notify: jest.fn(() => true),
      },
    };

    model = new Model(observerEventsMock);
    model.setOptions({
      min: -10,
      max: 10,
      from: 0,
      isRange: true,
    });
  });

  it('should set to', () => {
    model.setOptions({
      min: -10,
      max: 10,
      from: 0,
      to: 5,
    });

    expect(model.getTo()).toEqual(5);
  });

  it('should set to with max value if to is undefined', () => {
    expect(model.getTo()).toEqual(model.getMax());
  });

  it('should set from', () => {
    model.setFrom(5);
    expect(model.getFrom()).toEqual(5);
  });

  it('show error message in console when from < min', () => {
    window.console.log = jest.fn();

    model.setFrom(-15);
    expect(window.console.log).toBeCalled();
  });

  it('show error message in console when from > max', () => {
    window.console.log = jest.fn();

    model.setFrom(15);
    expect(window.console.log).toBeCalled();
  });

  it('show error message in console when to < min', () => {
    window.console.log = jest.fn();

    model.setTo(-15);
    expect(window.console.log).toBeCalled();
  });

  it('show error message in console when to > max', () => {
    window.console.log = jest.fn();

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
    model.setIsRange(false);
    model.setTo(-10);

    model.setIsRange(true);

    expect(model.getTo()).toEqual(0);
    expect(model.getFrom()).toEqual(-10);
  });
});
