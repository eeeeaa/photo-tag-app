export function getNormalizedPosition(imageWidth, imageHeight, posX, posY) {
  let normalX = (posX / imageWidth).toFixed(3);
  let normalY = (posY / imageHeight).toFixed(3);
  return { normalX: normalX, normalY: normalY };
}
