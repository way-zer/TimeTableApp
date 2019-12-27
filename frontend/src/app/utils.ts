export function removeFrom<T>(arr: T[], a: T): T | null {
  const index = arr.indexOf(a);
  if (index > -1) {
    arr.splice(index, 1);
    return a;
  }
  return null;
}

export function padNumber(num: number | string, n: number): string {
  let len = num.toString().length;
  while (len < n) {
    num = '0' + num;
    len++;
  }
  return num.toString();
}
