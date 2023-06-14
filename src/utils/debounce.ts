export const debounce = <T extends any[]>(func: (...args: T) => void, delay: number) => {
  let timerId: ReturnType<typeof setTimeout> | undefined;
  return (...args: T) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      func.apply(null, args);
    }, delay);

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  };
};