function getDirectionLiteral(isVertical: boolean) {
  return isVertical ? 'top' : 'left';
}

function getOffsetLiteral(isVertical: boolean) {
  return isVertical ? 'offsetTop' : 'offsetLeft';
}

function getSizeLiteral(isVertical: boolean) {
  return isVertical ? 'height' : 'width';
}

export { getDirectionLiteral, getOffsetLiteral, getSizeLiteral };
