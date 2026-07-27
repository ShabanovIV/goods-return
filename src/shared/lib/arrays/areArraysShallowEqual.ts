export const areArraysShallowEqual = (
  prev: readonly unknown[],
  next: readonly unknown[],
): boolean => {
  if (prev.length !== next.length) {
    return false;
  }

  return prev.every((item, index) => Object.is(item, next[index]));
};
