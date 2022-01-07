import createElement from '@/helpers/createElement';
import Bar from '@/views/Bar';

describe('Bar', () => {
  let bar: Bar | null = null;
  let track: HTMLElement | null = null;

  beforeEach(() => {
    track = createElement('div', {
      class: 'slider__track',
      style: `width: 280px;
              height: 20px;
              position: absolute;`,
    });

    document.body.append(track);
    bar = new Bar(track);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render', () => {
    bar?.show(true);
    expect(document.querySelector('.slider__bar')).toBeInTheDocument();
  });

  it('should not render', () => {
    bar?.show(false);
    expect(document.querySelector('.slider__bar')).not.toBeInTheDocument();
  });

  it('should update with single thumb and horizontal slider', () => {
    bar?.show(true);

    const rect: DOMRect = {
      ...track!.getBoundingClientRect(),
      ...{ width: 280 },
    };

    track!.getBoundingClientRect = jest.fn((): DOMRect => rect);

    bar?.update({
      firstThumbOffset: { offsetLeft: 132, offsetTop: 0 },
      secondThumbOffset: { offsetLeft: 0, offsetTop: 0 },
      thumbSize: { width: 15, height: 40 },
      isVertical: false,
      isRange: false,
    });

    const barStyle = window.getComputedStyle(bar!.element);
    const barWidth = parseInt(barStyle.width, 10);

    expect(barWidth).toBeCloseTo(49);
  });

  it('should update with single thumb and vertical slider', () => {
    bar?.show(true);

    const rect: DOMRect = {
      ...track!.getBoundingClientRect(),
      ...{ height: 280 },
    };

    track!.getBoundingClientRect = jest.fn((): DOMRect => rect);

    bar?.update({
      firstThumbOffset: { offsetLeft: 0, offsetTop: 132 },
      secondThumbOffset: { offsetLeft: 0, offsetTop: 0 },
      thumbSize: { width: 40, height: 15 },
      isVertical: true,
      isRange: false,
    });

    const barStyle = window.getComputedStyle(bar!.element);
    const barHeight = parseInt(barStyle.height, 10);

    expect(barHeight).toBeCloseTo(49);
  });

  it('should update with two thumbs and horizontal slider', () => {
    bar?.show(true);

    const rect: DOMRect = {
      ...track!.getBoundingClientRect(),
      ...{ width: 280 },
    };

    track!.getBoundingClientRect = jest.fn((): DOMRect => rect);

    bar?.update({
      firstThumbOffset: { offsetLeft: 132, offsetTop: 0 },
      secondThumbOffset: { offsetLeft: 265, offsetTop: 0 },
      thumbSize: { width: 15, height: 40 },
      isVertical: false,
      isRange: true,
    });

    const barStyle = window.getComputedStyle(bar!.element);
    const barWidth = parseInt(barStyle.width, 10);
    const barLeft = parseInt(barStyle.left, 10);

    expect(barWidth).toBeCloseTo(47);
    expect(barLeft).toBeCloseTo(49);
  });

  it('should update with two thumbs and vertical slider', () => {
    bar?.show(true);

    const rect: DOMRect = {
      ...track!.getBoundingClientRect(),
      ...{ height: 280 },
    };

    track!.getBoundingClientRect = jest.fn((): DOMRect => rect);

    bar?.update({
      firstThumbOffset: { offsetLeft: 0, offsetTop: 132 },
      secondThumbOffset: { offsetLeft: 0, offsetTop: 265 },
      thumbSize: { width: 40, height: 15 },
      isVertical: true,
      isRange: true,
    });

    const barStyle = window.getComputedStyle(bar!.element);
    const barHeight = parseInt(barStyle.height, 10);
    const barTop = parseInt(barStyle.top, 10);

    expect(barHeight).toBeCloseTo(47);
    expect(barTop).toBeCloseTo(49);
  });
});
