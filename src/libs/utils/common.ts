export const debounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
};

export const calculateDimensions = (width: number, height: number) => {
  // Add 12px for padding (6px each side)
  const containerWidth = Math.floor((width + 12) / 14) * 14;
  const containerHeight = Math.floor((height + 12) / 14) * 14;

  // Game area size (container - padding)
  const gameWidth = containerWidth - 12;
  const gameHeight = containerHeight - 12;

  return {
    containerWidth,
    containerHeight,
    gameWidth,
    gameHeight,
  };
};
