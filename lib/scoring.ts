export function calculateHolderHealth(
  holders: number,
  whaleConcentration: number
) {
  let score = 100;

  score -= whaleConcentration;

  if (holders < 100) score -= 20;

  return Math.max(0, Math.min(100, score));
}
