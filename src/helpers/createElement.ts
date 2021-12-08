function createElement(
  tag: string,
  attributes: string[],
  children?: HTMLElement[],
) {
  const element = document.createElement(tag);

  Object.entries(attributes).forEach(([attribute, value]: [string, string]) => {
    element.setAttribute(attribute, value);
  });

  if (children) {
    children?.forEach((child) => {
      element.append(child);
    });
  }

  return element;
}

export default createElement;
