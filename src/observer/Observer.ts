// https://refactoring.guru/ru/design-patterns/observer/typescript/example

import SliderProperties from '@/models/SliderProperties';

interface Observer {
  (state: SliderProperties): void;
}

interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(state: SliderProperties): void;
}

class Subject implements Subject {
  private observers: Observer[] = [];

  public attach(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (isExist) return;

    this.observers.push(observer);
  }

  public detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);

    if (observerIndex === -1) {
      return console.log('Subject: Nonexistent observer.');
    }

    this.observers.splice(observerIndex, 1);
  }

  public notify(state: any): void {
    for (const observer of this.observers) {
      observer(state);
    }
  }
}

export { Subject, Observer };
