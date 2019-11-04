export function removeFrom<T>(arr: T[], a: T): T|null {
  const index = arr.indexOf(a);
  if (index > -1) {
    arr.splice(index, 1);
    return a;
  }
  return null;
}
