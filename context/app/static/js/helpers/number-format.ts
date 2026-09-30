const decimal = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const percent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** A formatted count with its noun, pluralized by appending "s": `1 file`, `1,024 files`. */
function formatCount(count: number, noun: string) {
  return `${decimal.format(count)} ${noun}${count === 1 ? '' : 's'}`;
}

export { decimal, percent, formatCount };
