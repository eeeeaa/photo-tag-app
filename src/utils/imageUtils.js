export function getNormalizedPosition(imageWidth, imageHeight, posX, posY) {
  let normalX = Math.round((posX / imageWidth) * 1e3) / 1e3;
  let normalY = Math.round((posY / imageHeight) * 1e3) / 1e3;
  return { normalX: normalX, normalY: normalY };
}
