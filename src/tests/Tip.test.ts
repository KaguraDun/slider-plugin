import Tip from '@/views/Tip';

describe('Tip', () => {
  let firstTip: Tip;
  let firstThumb: HTMLElement;

  beforeEach(() => {
    firstThumb = document.createElement('div');
    document.body.append(firstThumb);
    firstTip = new Tip(firstThumb);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render', () => {
    firstTip.render({ value: '100', showTip: true });

    expect(firstTip.element).toBeInTheDocument();
    expect(firstTip.element.innerText).toEqual('100');
  });

  it('should not render', () => {
    firstTip.render({ value: '100', showTip: false });
    expect(firstTip.element).not.toBeInTheDocument();
  });

  it('should update', () => {
    firstTip.render({ value: '100', showTip: true });
    expect(firstTip.element.innerText).toEqual('100');

    firstTip.update('200');
    expect(firstTip.element.innerText).toEqual('200');
  });

  it('should set offset when horizontal slider', () => {
    firstTip.render({ value: '100', showTip: true });
    firstTip.setOffset({ isVertical: false, offset: -100 });

    expect(firstTip.element.style.transform).toEqual('translate(-100%)');
  });

  it('should set offset when vertical slider', () => {
    firstTip.render({ value: '100', showTip: true });
    firstTip.setOffset({ isVertical: true, offset: -100 });

    const defaultXOffset = -130;

    expect(firstTip.element.style.transform).toEqual(
      `translate(${defaultXOffset}%,-100%)`,
    );
  });

  it('should remove offset', () => {
    firstTip.render({ value: '100', showTip: true });
    firstTip.setOffset({ isVertical: true, offset: -100 });
    firstTip.removeOffset();

    expect(firstTip.element.style.transform).toEqual('');
  });

  it('should reset offset', () => {
    firstTip.render({ value: '100', showTip: true });
    firstTip.setOffset({ isVertical: true, offset: -100 });
    firstTip.resetOffset();

    expect(firstTip.element.style.transform).toEqual('none');
  });
});
