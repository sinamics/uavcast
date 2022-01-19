// helper function to set colors when editing surveys
export function hsl_col_perc(percent: number, start: number, end: number) {
  const a = percent / 100;
  const b = (end - start) * a;
  const c = b + start;

  // Return a CSS HSL string
  return 'hsl(' + c + ', 100%, 50%)';
}
