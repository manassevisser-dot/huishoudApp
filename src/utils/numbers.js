export const onlyDigits = (s) => s.replace(/[^0-9]/g, '');
export const onlyDigitsDotsComma = (s) => s.replace(/[^0-9.,]/g, '').replace(',', '.');
export const stripEmojiAndLimit = (s, max = 25) => {
    const noEmoji = s.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '');
    return noEmoji.slice(0, max);
};
export const formatCurrency = (amount) => new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
}).format(amount);
