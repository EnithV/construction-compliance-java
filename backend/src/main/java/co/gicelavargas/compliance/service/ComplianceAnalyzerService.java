package co.gicelavargas.compliance.service;

import co.gicelavargas.compliance.dto.AnalysisResult;
import co.gicelavargas.compliance.dto.ProjectInput;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ComplianceAnalyzerService {

    public AnalysisResult analyze(ProjectInput input) {
        double safetyScore = Math.max(0, 100 - input.getSafetyIncidents() * 20.0);
        double budgetPerf = Math.max(0, 100 - Math.abs(input.getBudgetVariance()));
        double schedulePerf = Math.max(0, 100 - Math.abs(input.getScheduleVariance()));
        double envScore = Math.max(20, 120 - input.getEnvironmentalComplexity() * 20.0);

        Map<String, Double> categories = new LinkedHashMap<>();
        categories.put("Technical", round((input.getPermitScore() + input.getQualityScore()) / 2));
        categories.put("Administrative", round(input.getPermitScore()));
        categories.put("Financial", round(budgetPerf));
        categories.put("Environmental", round(envScore));
        categories.put("Safety", round(safetyScore));

        double complianceScore = round(
                input.getPermitScore() * 0.25 +
                input.getQualityScore() * 0.20 +
                safetyScore * 0.20 +
                budgetPerf * 0.15 +
                schedulePerf * 0.10 +
                envScore * 0.10
        );

        String riskLevel = predictRisk(input);
        List<String> recommendations = buildRecommendations(input, complianceScore);
        List<String> regulations = List.of(
                "NSR-10 — Colombian Seismic Resistant Construction Standard",
                "Resolution 2115/2007 — Water Quality Standards",
                "Decree 1076/2015 — Environmental Regulations",
                "Resolution 0549/2015 — Construction Safety Standards"
        );

        return new AnalysisResult(
                input.getProjectName(),
                riskLevel,
                complianceScore,
                recommendations,
                categories,
                regulations
        );
    }

    private String predictRisk(ProjectInput input) {
        int riskFactors = 0;
        if (input.getPermitScore() < 70) riskFactors++;
        if (input.getContractorExperience() < 5) riskFactors++;
        if (input.getEnvironmentalComplexity() > 3) riskFactors++;
        if (input.getSafetyIncidents() > 2) riskFactors++;
        if (Math.abs(input.getBudgetVariance()) > 20) riskFactors++;
        if (Math.abs(input.getScheduleVariance()) > 30) riskFactors++;
        if (input.getQualityScore() < 70) riskFactors++;

        if (riskFactors >= 4) return "High Risk";
        if (riskFactors >= 2) return "Medium Risk";
        return "Low Risk";
    }

    private List<String> buildRecommendations(ProjectInput input, double score) {
        List<String> tips = new ArrayList<>();
        if (input.getPermitScore() < 75) {
            tips.add("Review permit documentation and licensing before the next audit.");
        }
        if (input.getSafetyIncidents() > 1) {
            tips.add("Strengthen site safety protocols per Resolution 0549/2015.");
        }
        if (Math.abs(input.getBudgetVariance()) > 15) {
            tips.add("Implement tighter budget controls and monthly variance reviews.");
        }
        if (input.getEnvironmentalComplexity() >= 4) {
            tips.add("Align environmental controls with Decree 1076/2015 and EIA requirements.");
        }
        if (input.getContractorExperience() < 5) {
            tips.add("Consider contractor supervision or additional technical oversight.");
        }
        if (score >= 85) {
            tips.add("Project shows strong compliance — maintain current controls.");
        } else if (score < 60) {
            tips.add("Schedule an immediate compliance review with engineering and legal teams.");
        }
        if (tips.isEmpty()) {
            tips.add("Continue periodic audits across all five compliance categories.");
        }
        return tips;
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
