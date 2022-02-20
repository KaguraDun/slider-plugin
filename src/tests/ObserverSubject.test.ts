import { ObserverSubject } from '@/observer/ObserverSubject';

describe('Observer', () => {
  const testObserverEvent: ObserverSubject<number> = new ObserverSubject();
  window.console.log = jest.fn((message: string) => message);

  it('should attach and notify function', () => {
    const testFunction = jest.fn((value: number) => value);

    testObserverEvent.attach(testFunction);
    testObserverEvent.notify(10);

    expect(testFunction).toBeCalledWith(10);
  });

  it('should not notify a function if it is not attached', () => {
    const testFunction = jest.fn((value: number) => value);

    testObserverEvent.notify(10);

    expect(testFunction).not.toBeCalled();
  });

  it('should detach function', () => {
    const testFunction = jest.fn((value: number) => value);

    testObserverEvent.attach(testFunction);
    testObserverEvent.detach(testFunction);
    testObserverEvent.notify(10);

    expect(testFunction).not.toBeCalled();
  });

  it("show error message if detached observer don't exist", () => {
    const testFunction = jest.fn((value: number) => value);
    const nonObservableFunction = jest.fn((value: number) => value);

    testObserverEvent.attach(testFunction);
    testObserverEvent.detach(nonObservableFunction);

    expect(window.console.log).toBeCalled();
  });
});
