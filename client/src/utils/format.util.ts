export const toVND = (number: number) => {
  return number.toLocaleString('vi', { style: 'currency', currency: 'VND' });
};
