export const isValidCoordinates = (coordinates) => {
  return Array.isArray(coordinates) &&
    coordinates[0] >= -180 && coordinates[0] <= 180 &&
    coordinates[1] >= -90 && coordinates[1] <= 90;
};