import Bar from '@/views/Bar';

describe('Bar', () => {
  let bar: Bar | null = null;
  let track: HTMLElement | null = null;

  beforeEach(() => {
    track = document.createElement('div');
    document.body.append(track);

    bar = new Bar(track);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render', () => {
    bar!.show(true);
    expect(bar!.element).toBeInTheDocument();
  });

  it('should not render', () => {
    bar!.show(false);
    expect(bar!.element).not.toBeInTheDocument();
  });

  it('should update with single thumb and horizontal slider', () => {
    bar!.show(true);
    bar!.update({
      firstThumbOffsetPercent: 50,
      distanceBetweenThumbs: 0,
      isVertical: false,
      isRange: false,
    });

    const barStyle = window.getComputedStyle(bar!.element);
    const barWidth = parseInt(barStyle.width, 10);

    expect(barWidth).toBeCloseTo(50);
  });

  it('should update with single thumb and vertical slider', () => {
    bar!.show(true);
    bar!.update({
      firstThumbOffsetPercent: 50,
      distanceBetweenThumbs: 0,
      isVertical: true,
      isRange: false,
    });

    const barStyle = window.getComputedStyle(bar!.element);
    const barHeight = parseInt(barStyle.height, 10);

    expect(barHeight).toBeCloseTo(50);
  });

  it('should update with two thumbs and horizontal slider', () => {
    bar!.show(true);
    bar!.update({
      firstThumbOffsetPercent: 50,
      distanceBetweenThumbs: 30,
      isVertical: false,
      isRange: true,
    });

    const barStyle = window.getComputedStyle(bar!.element);
    const barWidth = parseInt(barStyle.width, 10);
    const barLeft = parseInt(barStyle.left, 10);

    expect(barLeft).toBeCloseTo(50);
    expect(barWidth).toBeCloseTo(30);
  });

  it('should update with two thumbs and vertical slider', () => {
    bar!.show(true);
    bar!.update({
      firstThumbOffsetPercent: 50,
      distanceBetweenThumbs: 30,
      isVertical: true,
      isRange: true,
    });

    const barStyle = window.getComputedStyle(bar!.element);
    const barHeight = parseInt(barStyle.height, 10);
    const barTop = parseInt(barStyle.top, 10);

    expect(barTop).toBeCloseTo(50);
    expect(barHeight).toBeCloseTo(30);
  });
});
