export function getNormalizedPosition(imageWidth, imageHeight, posX, posY) {
  return { normalX: posX / imageWidth, normalY: posY / imageHeight };
}
