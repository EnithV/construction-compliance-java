package co.gicelavargas.compliance.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class ProjectInput {

    @NotBlank
    private String projectName;

    private String projectType = "Infrastructure";

    @Min(0) @Max(100)
    private double permitScore = 80;

    @Min(0) @Max(100)
    private double qualityScore = 80;

    @Min(0) @Max(20)
    private int safetyIncidents = 0;

    @Min(-50) @Max(50)
    private double budgetVariance = 0;

    @Min(-50) @Max(50)
    private double scheduleVariance = 0;

    @Min(1) @Max(5)
    private int environmentalComplexity = 2;

    @Min(0) @Max(40)
    private int contractorExperience = 10;

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    public String getProjectType() { return projectType; }
    public void setProjectType(String projectType) { this.projectType = projectType; }
    public double getPermitScore() { return permitScore; }
    public void setPermitScore(double permitScore) { this.permitScore = permitScore; }
    public double getQualityScore() { return qualityScore; }
    public void setQualityScore(double qualityScore) { this.qualityScore = qualityScore; }
    public int getSafetyIncidents() { return safetyIncidents; }
    public void setSafetyIncidents(int safetyIncidents) { this.safetyIncidents = safetyIncidents; }
    public double getBudgetVariance() { return budgetVariance; }
    public void setBudgetVariance(double budgetVariance) { this.budgetVariance = budgetVariance; }
    public double getScheduleVariance() { return scheduleVariance; }
    public void setScheduleVariance(double scheduleVariance) { this.scheduleVariance = scheduleVariance; }
    public int getEnvironmentalComplexity() { return environmentalComplexity; }
    public void setEnvironmentalComplexity(int environmentalComplexity) { this.environmentalComplexity = environmentalComplexity; }
    public int getContractorExperience() { return contractorExperience; }
    public void setContractorExperience(int contractorExperience) { this.contractorExperience = contractorExperience; }
}
