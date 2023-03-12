export const shallowEquals = (arr1: any[], arr2: any[]) => {
  if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;
  let equals = true;
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) equals = false;
  }
  return equals;
};
