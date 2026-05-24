package co.gicelavargas.compliance.controller;

import co.gicelavargas.compliance.dto.AnalysisResult;
import co.gicelavargas.compliance.dto.ProjectInput;
import co.gicelavargas.compliance.service.ComplianceAnalyzerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ComplianceController {

    private final ComplianceAnalyzerService analyzerService;

    public ComplianceController(ComplianceAnalyzerService analyzerService) {
        this.analyzerService = analyzerService;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "service", "construction-compliance-api");
    }

    @PostMapping("/analyze")
    public ResponseEntity<AnalysisResult> analyze(@Valid @RequestBody ProjectInput input) {
        return ResponseEntity.ok(analyzerService.analyze(input));
    }
}
