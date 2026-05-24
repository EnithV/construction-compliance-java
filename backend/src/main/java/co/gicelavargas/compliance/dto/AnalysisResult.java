package co.gicelavargas.compliance.dto;

import java.util.List;
import java.util.Map;

public class AnalysisResult {

    private String projectName;
    private String riskLevel;
    private double complianceScore;
    private List<String> recommendations;
    private Map<String, Double> categoryScores;
    private List<String> regulationsApplied;

    public AnalysisResult() {}

    public AnalysisResult(String projectName, String riskLevel, double complianceScore,
                          List<String> recommendations, Map<String, Double> categoryScores,
                          List<String> regulationsApplied) {
        this.projectName = projectName;
        this.riskLevel = riskLevel;
        this.complianceScore = complianceScore;
        this.recommendations = recommendations;
        this.categoryScores = categoryScores;
        this.regulationsApplied = regulationsApplied;
    }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public double getComplianceScore() { return complianceScore; }
    public void setComplianceScore(double complianceScore) { this.complianceScore = complianceScore; }
    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }
    public Map<String, Double> getCategoryScores() { return categoryScores; }
    public void setCategoryScores(Map<String, Double> categoryScores) { this.categoryScores = categoryScores; }
    public List<String> getRegulationsApplied() { return regulationsApplied; }
    public void setRegulationsApplied(List<String> regulationsApplied) { this.regulationsApplied = regulationsApplied; }
}
