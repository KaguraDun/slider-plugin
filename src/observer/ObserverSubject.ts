type Observer<T> = {
  (state: T): void;
};

class ObserverSubject<T> {
  private observers: Observer<T>[] = [];

  attach(observer: Observer<T>): void {
    const isExist = this.observers.includes(observer);
    if (isExist) return;

    this.observers.push(observer);
  }

  detach(observer: Observer<T>): void {
    const observerIndex = this.observers.indexOf(observer);

    if (observerIndex === -1) {
      return console.log('Subject: Nonexistent observer.');
    }

    this.observers.splice(observerIndex, 1);
  }

  notify(value: T): void {
    for (const observer of this.observers) {
      observer(value);
    }
  }
}

export { ObserverSubject };
export type { Observer };
