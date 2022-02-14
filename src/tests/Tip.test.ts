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