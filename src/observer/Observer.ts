// https://refactoring.guru/ru/design-patterns/observer/typescript/example

type Observer<T> = {
  (state: T): void;
};

class Subject<T> {
  private observers: Observer<T>[] = [];

  public attach(observer: Observer<T>): void {
    const isExist = this.observers.includes(observer);
    if (isExist) return;

    this.observers.push(observer);
  }

  public detach(observer: Observer<T>): void {
    const observerIndex = this.observers.indexOf(observer);

    if (observerIndex === -1) {
      return console.log('Subject: Nonexistent observer.');
    }

    this.observers.splice(observerIndex, 1);
  }

  public notify(value: T): void {
    for (const observer of this.observers) {
      observer(value);
    }
  }
}

export { Subject };
export type { Observer };
