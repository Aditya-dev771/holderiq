export function getHolderGrade(score: number) {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 50) return "C";
  return "D";
}

export function getWhaleRisk(whaleConcentration: number) {
  if (whaleConcentration <= 15) return "Low";
  if (whaleConcentration <= 30) return "Medium";
  return "High";
}

export function generateInsight(
  holderHealth: number,
  totalHolders: number,
  whaleConcentration: number
) {
  const grade = getHolderGrade(holderHealth);
  const whaleRisk = getWhaleRisk(whaleConcentration);

  if (grade === "A") {
    return {
      grade,
      whaleRisk,
      message:
        "Holder health is strong. The collection has healthy distribution, low whale risk, and a solid holder base.",
    };
  }

  if (grade === "B") {
    return {
      grade,
      whaleRisk,
      message:
        "Holder health is good. The community looks stable, but founder should keep watching whale movement and retention.",
    };
  }

  if (grade === "C") {
    return {
      grade,
      whaleRisk,
      message:
        "Holder health is moderate. There may be concentration risk or weak holder distribution. Founder should focus on retention.",
    };
  }

  return {
    grade,
    whaleRisk,
    message:
      "Holder health is weak. High concentration or low holder strength may create community risk.",
  };
}