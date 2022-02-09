import Tip from '@/views/Tip';

describe('Tip', () => {
  let firstTip: Tip | null = null;
  let firstThumb: HTMLElement | null = null;

  beforeEach(() => {
    firstThumb = document.createElement('div');
    document.body.append(firstThumb);
    firstTip = new Tip(firstThumb);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render', () => {
    firstTip!.render({ value: '100', showTip: true });

    expect(firstTip!.element).toBeInTheDocument();
    expect(firstTip!.element.innerText).toEqual('100');
  });

  it('should not render', () => {
    firstTip!.render({ value: '100', showTip: false });

    expect(firstTip!.element).not.toBeInTheDocument();
  });

  it('should update', () => {
    firstTip!.render({ value: '100', showTip: true });

    expect(firstTip!.element.innerText).toEqual('100');
    firstTip!.update('200');
    expect(firstTip!.element.innerText).toEqual('200');
  });

  it('should check tip intersection when horizontal slider as true', () => {
    firstTip!.render({ value: '100', showTip: true });

    const secondThumb = document.createElement('div');
    const secondTip = new Tip(secondThumb);

    secondTip.render({
      value: '101',
      showTip: true,
    });

    const firstTipRect: DOMRect = {
      ...firstTip!.element.getBoundingClientRect(),
      ...{
        left: 502,
        top: 43,
        width: 25,
        height: 25,
      },
    };

    const secondTipRect: DOMRect = {
      ...firstTip!.element.getBoundingClientRect(),
      ...{
        left: 526,
        top: 43,
        width: 30,
        height: 25,
      },
    };

    firstTip!.element.getBoundingClientRect = jest.fn(
      (): DOMRect => firstTipRect,
    );
    secondTip!.element.getBoundingClientRect = jest.fn(
      (): DOMRect => secondTipRect,
    );

    const isExpanded = Tip.checkIntersection({
      firstTip: firstTip!.element,
      secondTip: secondTip.element,
      isVertical: false,
    });

    firstTip!.render({  value: '100', showTip: true });

    expect(isExpanded).toEqual(true);
  });

  it('should check tip intersection when horizontal slider as false', () => {
    firstTip!.render({  value: '100', showTip: true });

    const secondThumb = document.createElement('div');
    const secondTip = new Tip(secondThumb);

    secondTip.render({
      value: '150',
      showTip: true,
    });

    const firstTipRect: DOMRect = {
      ...firstTip!.element.getBoundingClientRect(),
      ...{
        left: 396,
        top: 43,
        width: 25,
        height: 25,
      },
    };

    const secondTipRect: DOMRect = {
      ...firstTip!.element.getBoundingClientRect(),
      ...{
        left: 526,
        top: 43,
        width: 30,
        height: 25,
      },
    };

    firstTip!.element.getBoundingClientRect = jest.fn(
      (): DOMRect => firstTipRect,
    );
    secondTip!.element.getBoundingClientRect = jest.fn(
      (): DOMRect => secondTipRect,
    );

    const isExpanded = Tip.checkIntersection({
      firstTip: firstTip!.element,
      secondTip: secondTip.element,
      isVertical: false,
    });

    firstTip!.render({  value: '100', showTip: true });

    expect(isExpanded).toEqual(false);
  });

  it('should check tip intersection when vertical slider as true', () => {
    firstTip!.render({  value: '100', showTip: true });

    const secondThumb = document.createElement('div');
    const secondTip = new Tip(secondThumb);

    secondTip.render({
      value: '101',
      showTip: true,
    });

    const firstTipRect: DOMRect = {
      ...firstTip!.element.getBoundingClientRect(),
      ...{
        height: 25,
        left: 356,
        top: 218,
        width: 25,
      },
    };

    const secondTipRect: DOMRect = {
      ...firstTip!.element.getBoundingClientRect(),
      ...{
        height: 25,
        left: 349,
        top: 231,
        width: 25,
      },
    };

    firstTip!.element.getBoundingClientRect = jest.fn(
      (): DOMRect => firstTipRect,
    );
    secondTip!.element.getBoundingClientRect = jest.fn(
      (): DOMRect => secondTipRect,
    );

    const isExpanded = Tip.checkIntersection({
      firstTip: firstTip!.element,
      secondTip: secondTip.element,
      isVertical: true,
    });

    firstTip!.render({  value: '100', showTip: true });

    expect(isExpanded).toEqual(true);
  });

  it('should check tip intersection when vertical slider as false', () => {
    firstTip!.render({  value: '100', showTip: true });

    const secondThumb = document.createElement('div');
    const secondTip = new Tip(secondThumb);

    secondTip.render({
      value: '150',
      showTip: true,
    });

    const firstTipRect: DOMRect = {
      ...firstTip!.element.getBoundingClientRect(),
      ...{
        height: 25,
        left: 356,
        top: 99,
        width: 25,
      },
    };

    const secondTipRect: DOMRect = {
      ...firstTip!.element.getBoundingClientRect(),
      ...{
        height: 25,
        left: 349,
        top: 231,
        width: 25,
      },
    };

    firstTip!.element.getBoundingClientRect = jest.fn(
      (): DOMRect => firstTipRect,
    );
    secondTip!.element.getBoundingClientRect = jest.fn(
      (): DOMRect => secondTipRect,
    );

    const isExpanded = Tip.checkIntersection({
      firstTip: firstTip!.element,
      secondTip: secondTip.element,
      isVertical: true,
    });

    firstTip!.render({  value: '100', showTip: true });

    expect(isExpanded).toEqual(false);
  });
});
