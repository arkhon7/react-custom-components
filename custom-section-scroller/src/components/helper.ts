export const throttle = (cb: any, delay: number = 500) => {
  let shouldWait = false;

  return (...arg: any) => {
    if (shouldWait) return;

    cb(...arg);
    shouldWait = true;
    setTimeout(() => {
      shouldWait = false;
    }, delay);
  };
};
