export function getShortUniqueString(): string {
  const now = new Date();
  const randomNumber = Math.ceil(Math.random() * 99);
  return `${process.pid}${randomNumber}${now.getMilliseconds()}`;
}
