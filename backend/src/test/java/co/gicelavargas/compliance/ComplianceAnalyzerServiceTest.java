package co.gicelavargas.compliance;

import co.gicelavargas.compliance.dto.AnalysisResult;
import co.gicelavargas.compliance.dto.ProjectInput;
import co.gicelavargas.compliance.service.ComplianceAnalyzerService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ComplianceAnalyzerServiceTest {

    private final ComplianceAnalyzerService service = new ComplianceAnalyzerService();

    @Test
    void analyzeReturnsLowRiskForStrongProject() {
        ProjectInput input = new ProjectInput();
        input.setProjectName("Bridge Phase 1");
        input.setPermitScore(90);
        input.setQualityScore(88);
        input.setSafetyIncidents(0);
        input.setBudgetVariance(5);
        input.setScheduleVariance(8);
        input.setEnvironmentalComplexity(2);
        input.setContractorExperience(12);

        AnalysisResult result = service.analyze(input);
        assertEquals("Low Risk", result.getRiskLevel());
        assertTrue(result.getComplianceScore() >= 70);
    }
}
