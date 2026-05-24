/** Client-side analyzer (same rules as Java ComplianceAnalyzerService) — works on GitHub Pages */
const ComplianceEngine = {
  analyze(input) {
    const safetyScore = Math.max(0, 100 - input.safetyIncidents * 20);
    const budgetPerf = Math.max(0, 100 - Math.abs(input.budgetVariance));
    const schedulePerf = Math.max(0, 100 - Math.abs(input.scheduleVariance));
    const envScore = Math.max(20, 120 - input.environmentalComplexity * 20);

    const categories = {
      Technical: round((input.permitScore + input.qualityScore) / 2),
      Administrative: round(input.permitScore),
      Financial: round(budgetPerf),
      Environmental: round(envScore),
      Safety: round(safetyScore)
    };

    const complianceScore = round(
      input.permitScore * 0.25 +
      input.qualityScore * 0.2 +
      safetyScore * 0.2 +
      budgetPerf * 0.15 +
      schedulePerf * 0.1 +
      envScore * 0.1
    );

    const riskLevel = this.predictRisk(input);
    return {
      projectName: input.projectName,
      riskLevel,
      complianceScore,
      categoryScores: categories,
      recommendations: this.buildRecommendations(input, complianceScore),
      regulationsApplied: [
        "NSR-10 — Colombian Seismic Resistant Construction Standard",
        "Resolution 2115/2007 — Water Quality Standards",
        "Decree 1076/2015 — Environmental Regulations",
        "Resolution 0549/2015 — Construction Safety Standards"
      ]
    };
  },

  predictRisk(input) {
    let factors = 0;
    if (input.permitScore < 70) factors++;
    if (input.contractorExperience < 5) factors++;
    if (input.environmentalComplexity > 3) factors++;
    if (input.safetyIncidents > 2) factors++;
    if (Math.abs(input.budgetVariance) > 20) factors++;
    if (Math.abs(input.scheduleVariance) > 30) factors++;
    if (input.qualityScore < 70) factors++;
    if (factors >= 4) return "High Risk";
    if (factors >= 2) return "Medium Risk";
    return "Low Risk";
  },

  buildRecommendations(input, score) {
    const tips = [];
    if (input.permitScore < 75) tips.push("Review permit documentation and licensing before the next audit.");
    if (input.safetyIncidents > 1) tips.push("Strengthen site safety protocols per Resolution 0549/2015.");
    if (Math.abs(input.budgetVariance) > 15) tips.push("Implement tighter budget controls and monthly variance reviews.");
    if (input.environmentalComplexity >= 4) tips.push("Align environmental controls with Decree 1076/2015 and EIA requirements.");
    if (input.contractorExperience < 5) tips.push("Consider contractor supervision or additional technical oversight.");
    if (score >= 85) tips.push("Project shows strong compliance — maintain current controls.");
    else if (score < 60) tips.push("Schedule an immediate compliance review with engineering and legal teams.");
    if (!tips.length) tips.push("Continue periodic audits across all five compliance categories.");
    return tips;
  }
};

function round(v) {
  return Math.round(v * 10) / 10;
}
