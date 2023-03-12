export const arrayDiff = (arr1: any[], arr2: any[]) => {
  return arr1.map((a, i) => {
    return a - arr2[i];
  });
};
