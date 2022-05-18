/**
 * A file to hold helpful functions that do basic things like string formatting
 *
 */

export const formatValue = (value: number, type: string) => {
  // FIXME handle NaN
  if (type == null || value == null) return value;

  switch(type) {
  case 'percentage':
      return `${(value * 100).toFixed(2)}%`;
  case 'currency':
      // code block
      return value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
      });
  default:
      return value;
  }
}
