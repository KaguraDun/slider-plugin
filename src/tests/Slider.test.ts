import Slider from '@/views/Slider';

describe('Slider', () => {
  const container = document.createElement('div');
  document.body.append(container);

  let slider: Slider | null = null;

  beforeEach(() => {
    slider = new Slider();
  });
  afterEach(() => {
    container.innerHTML = '';
  });

  it('should render', () => {
    slider!.render(container);

    expect(slider!.element).toBeInTheDocument();
  });

  it('should toggle vertical', () => {
    slider!.render(container);

    slider!.toggleVertical(true);
    expect(slider!.element).toHaveClass('slider_vertical');

    slider!.toggleVertical(false);
    expect(slider!.element).not.toHaveClass('slider_vertical');
  });
});
