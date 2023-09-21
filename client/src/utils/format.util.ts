export const toVND = (number: number) => {
  return number.toLocaleString('vi', { style: 'currency', currency: 'VND' });
};

export const toAbbreviated = (number: number) => {
  const formatNumber = (number: number) => {
    if (number < 1e3) return number;
    if (number >= 1e3 && number < 1e6) return +(number / 1e3).toFixed(1) + 'K';
    if (number >= 1e6 && number < 1e9) return +(number / 1e6).toFixed(1) + 'M';
    if (number >= 1e9 && number < 1e12) return +(number / 1e9).toFixed(1) + 'B';
    if (number >= 1e12) return +(number / 1e12).toFixed(1) + 'T';
  };

  return number > 0 ? formatNumber(number) : `-${formatNumber(number * -1)}`;
};
