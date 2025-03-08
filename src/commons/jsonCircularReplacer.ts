/**
 * Returns a function that can be used as a replacer in `JSON.stringify` to handle circular references.
 *
 * @returns {Function} A replacer function that can be used in `JSON.stringify`.
 */
export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: string, value: any): any => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};
