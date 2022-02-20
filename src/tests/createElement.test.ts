import createElement from '@/helpers/createElement';

describe('Create element', () => {
  it('should return element with class', () => {
    const element = createElement('div', { class: 'test-element' });

    expect(element.tagName).toEqual('DIV');
    expect(element.className).toEqual('test-element');
  });

  it('should return element with text', () => {
    const element = createElement('div', { class: 'test-element' }, ['text']);

    expect(element.innerHTML).toEqual('text');
  });
});
