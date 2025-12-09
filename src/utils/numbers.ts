export const onlyDigits = (s: string) => s.replace(/[^0-9]/g, '');

export const onlyDigitsDotsComma = (s: string) => 
  s.replace(/[^0-9.,]/g, '').replace(',', '.');

export const stripEmojiAndLimit = (s: string, max = 25) => {
  const noEmoji = s.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '');
  return noEmoji.slice(0, max);
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
