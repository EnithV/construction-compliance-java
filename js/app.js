(function () {
  const API_BASE = window.COMPLIANCE_API_URL || "";

  const form = document.getElementById("analysis-form");
  const results = document.getElementById("results-panel");
  const apiBadge = document.getElementById("api-mode-badge");

  function readForm() {
    return {
      projectName: document.getElementById("projectName").value.trim() || "New Project",
      projectType: document.getElementById("projectType").value,
      permitScore: Number(document.getElementById("permitScore").value),
      qualityScore: Number(document.getElementById("qualityScore").value),
      safetyIncidents: Number(document.getElementById("safetyIncidents").value),
      budgetVariance: Number(document.getElementById("budgetVariance").value),
      scheduleVariance: Number(document.getElementById("scheduleVariance").value),
      environmentalComplexity: Number(document.getElementById("environmentalComplexity").value),
      contractorExperience: Number(document.getElementById("contractorExperience").value)
    };
  }

  async function analyze(input) {
    if (API_BASE) {
      const res = await fetch(`${API_BASE.replace(/\/$/, "")}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });
      if (!res.ok) throw new Error("API error");
      return res.json();
    }
    return ComplianceEngine.analyze(input);
  }

  function riskClass(level) {
    if (level === "High Risk") return "bg-danger";
    if (level === "Medium Risk") return "bg-warning text-dark";
    return "bg-success";
  }

  function progressBarClass(value) {
    if (value < 50) return "bg-danger";
    if (value < 75) return "bg-warning";
    return "bg-success";
  }

  function render(data) {
    const scoreEl = document.getElementById("score-value");
    const riskEl = document.getElementById("risk-badge");
    scoreEl.textContent = `${data.complianceScore}%`;
    riskEl.textContent = data.riskLevel;
    riskEl.className = `badge fs-6 ${riskClass(data.riskLevel)}`;

    const catList = document.getElementById("category-scores");
    catList.innerHTML = Object.entries(data.categoryScores)
      .map(
        ([k, v]) =>
          `<li class="list-group-item px-0">
            <div class="d-flex justify-content-between mb-1"><span>${k}</span><strong>${v}%</strong></div>
            <div class="progress" style="height: 8px" role="progressbar" aria-valuenow="${v}" aria-valuemin="0" aria-valuemax="100">
              <div class="progress-bar ${progressBarClass(v)}" style="width: ${v}%"></div>
            </div>
          </li>`
      )
      .join("");

    const recList = document.getElementById("recommendations");
    recList.innerHTML = data.recommendations.map((r) => `<li>${r}</li>`).join("");

    const regList = document.getElementById("regulations");
    regList.innerHTML = data.regulationsApplied.map((r) => `<li class="small text-secondary">${r}</li>`).join("");

    document.getElementById("result-title").textContent = data.projectName;
    results.classList.remove("d-none");
    results.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  if (apiBadge) {
    const isEs = document.documentElement.lang === "es";
    apiBadge.textContent = API_BASE
      ? (isEs ? "API Spring Boot" : "Spring Boot API")
      : (isEs ? "Motor en el navegador (GitHub Pages)" : "Client engine (GitHub Pages)");
    apiBadge.className = API_BASE ? "badge text-bg-primary" : "badge text-bg-secondary";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    try {
      const data = await analyze(readForm());
      render(data);
    } catch (err) {
      alert("Analysis failed. If using the API, start Spring Boot on port 8080.");
    } finally {
      btn.disabled = false;
    }
  });
})();
