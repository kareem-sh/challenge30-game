export const ROUND_KEY_BY_NUMBER = {
  1: "round1",
  2: "round2",
  3: "round3",
  4: "round4",
};

export const DEFAULT_ROUND_NAMES = {
  round1: "لعبة الأسماء",
  round2: "جولة المزاد",
  round3: "جولة السرعة",
  round4: "تحدي الصور",
};

export function getRoundName(settings, roundNumber) {
  const roundKey = ROUND_KEY_BY_NUMBER[roundNumber];

  if (!roundKey) return `الجولة ${roundNumber}`;

  return settings?.roundNames?.[roundKey] || DEFAULT_ROUND_NAMES[roundKey];
}
