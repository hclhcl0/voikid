const SMALL = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen',
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const SMALL_NUMBER_WORDS = new Set([...SMALL.slice(1), ...TENS.slice(2)]);

function cardinalWords(value: number): string {
  if (value < 20) return SMALL[value];
  if (value < 100) return `${TENS[Math.floor(value / 10)]}${value % 10 ? ` ${SMALL[value % 10]}` : ''}`;
  const scale = value < 1000 ? 100 : 1000;
  const remainder = value % scale;
  return `${cardinalWords(Math.floor(value / scale))} ${scale === 100 ? 'hundred' : 'thousand'}${remainder ? ` ${cardinalWords(remainder)}` : ''}`;
}

/** Expand unambiguous cardinal numerals, preserving unsupported numeric formats. */
export function expandCardinalDigits(text: string): string {
  return text.replace(/\d+(?:,\d+)*/g, (digits: string, offset: number) => {
    const before = text.slice(0, offset);
    const after = text.slice(offset + digits.length);
    // Do not reinterpret codes, ordinals, leading zeroes, signs, decimals, times,
    // fractions, ranges or percentages as a spoken cardinal number.
    if (!/^(?:0|[1-9]\d*|[1-9]\d{0,2}(?:,\d{3})+)$/.test(digits)
      || /[\p{L}\p{N}_$€£¥%/:+−‐‑‒–—-]$/u.test(before)
      || /^[\p{L}\p{N}_$€£¥%/:+−‐‑‒–—-]/u.test(after)
      || /[+−‐‑‒–—\-/:]\s*$/.test(before)
      || /^\s*[%/:+−‐‑‒–—-]/.test(after)
      || /\.\s*$/.test(before)
      || /^\.\s*\d/.test(after)) return digits;
    const value = Number(digits.replace(/,/g, ''));
    return value <= 999999 ? cardinalWords(value) : digits;
  });
}

/** "One hundred and five" and "one hundred five" are the same cardinal. */
export function normalizeCardinalConjunctions(tokens: string[]): string[] {
  return tokens.filter((token, index) => !(token === 'and'
    && ['hundred', 'thousand'].includes(tokens[index - 1])
    && SMALL_NUMBER_WORDS.has(tokens[index + 1])));
}
