(function () {
  const API_BASE = window.COMPLIANCE_API_URL || "";
  const isEs = document.documentElement.lang === "es";

  const COPY = {
    en: {
      risk: { "High Risk": "High Risk", "Medium Risk": "Medium Risk", "Low Risk": "Low Risk" },
      categories: {
        Technical: "Technical",
        Administrative: "Administrative",
        Financial: "Financial",
        Environmental: "Environmental",
        Safety: "Safety"
      },
      icons: {
        Technical: "fa-gears",
        Administrative: "fa-file-contract",
        Financial: "fa-coins",
        Environmental: "fa-leaf",
        Safety: "fa-shield-halved"
      },
      apiClient: "Client engine (GitHub Pages)",
      apiSpring: "Spring Boot API",
      scoreStrong: "Strong compliance — maintain current controls.",
      scoreModerate: "Moderate compliance — review highlighted categories.",
      scoreWeak: "Low compliance — schedule an engineering and legal review.",
      analyzing: "Analyzing…",
      analyze: "Analyze compliance",
      error: "Analysis failed. If using the API, start Spring Boot on port 8080."
    },
    es: {
      risk: { "High Risk": "Riesgo alto", "Medium Risk": "Riesgo medio", "Low Risk": "Riesgo bajo" },
      categories: {
        Technical: "Técnico",
        Administrative: "Administrativo",
        Financial: "Financiero",
        Environmental: "Ambiental",
        Safety: "Seguridad"
      },
      icons: {
        Technical: "fa-gears",
        Administrative: "fa-file-contract",
        Financial: "fa-coins",
        Environmental: "fa-leaf",
        Safety: "fa-shield-halved"
      },
      apiClient: "Motor en el navegador (GitHub Pages)",
      apiSpring: "API Spring Boot",
      scoreStrong: "Cumplimiento sólido — mantener los controles actuales.",
      scoreModerate: "Cumplimiento moderado — revisar las categorías señaladas.",
      scoreWeak: "Cumplimiento bajo — programar revisión con ingeniería y legal.",
      analyzing: "Analizando…",
      analyze: "Analizar cumplimiento",
      error: "Error en el análisis. Si usas la API, inicia Spring Boot en el puerto 8080."
    }
  };

  const t = COPY[isEs ? "es" : "en"];

  const form = document.getElementById("analysis-form");
  const results = document.getElementById("results-panel");
  const placeholder = document.getElementById("results-placeholder");
  const apiBadge = document.getElementById("api-mode-badge");
  const analyzeBtn = document.getElementById("analyze-btn");
  const btnLabel = analyzeBtn?.querySelector(".btn-label");

  function readForm() {
    return {
      projectName: document.getElementById("projectName").value.trim() || (isEs ? "Nuevo proyecto" : "New Project"),
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

  function ringColor(score) {
    if (score < 60) return "var(--cc-danger)";
    if (score < 75) return "var(--cc-amber)";
    return "var(--cc-success)";
  }

  function scoreSummary(score) {
    if (score >= 85) return t.scoreStrong;
    if (score >= 60) return t.scoreModerate;
    return t.scoreWeak;
  }

  function showToast(message) {
    const host = document.getElementById("toast-host");
    if (!host || !window.bootstrap) {
      alert(message);
      return;
    }
    const id = "toast-" + Date.now();
    host.insertAdjacentHTML(
      "beforeend",
      `<div id="${id}" class="toast align-items-center text-bg-danger border-0" role="alert">
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>`
    );
    const el = document.getElementById(id);
    const toast = new bootstrap.Toast(el, { delay: 5000 });
    toast.show();
    el.addEventListener("hidden.bs.toast", () => el.remove());
  }

  function setLoading(loading) {
    if (!analyzeBtn) return;
    analyzeBtn.disabled = loading;
    if (btnLabel) {
      btnLabel.textContent = loading ? t.analyzing : t.analyze;
    }
  }

  function render(data, projectType) {
    const score = data.complianceScore;
    const ring = document.getElementById("score-ring");
    const scoreEl = document.getElementById("score-value");
    const riskEl = document.getElementById("risk-badge");

    scoreEl.innerHTML = `${score}<small>%</small>`;
    if (ring) {
      ring.style.setProperty("--score", score);
      ring.style.setProperty("--ring-color", ringColor(score));
    }

    riskEl.textContent = t.risk[data.riskLevel] || data.riskLevel;
    riskEl.className = `badge ${riskClass(data.riskLevel)}`;

    document.getElementById("result-title").textContent = data.projectName;
    const typeEl = document.getElementById("project-type-display");
    if (typeEl) typeEl.textContent = projectType;

    const summaryEl = document.getElementById("score-summary");
    if (summaryEl) summaryEl.textContent = scoreSummary(score);

    const catGrid = document.getElementById("category-scores");
    catGrid.innerHTML = Object.entries(data.categoryScores)
      .map(([k, v]) => {
        const label = t.categories[k] || k;
        const icon = t.icons[k] || "fa-chart-simple";
        return `<div class="category-item">
          <div class="category-item-header">
            <span><i class="fa-solid ${icon}" aria-hidden="true"></i>${label}</span>
            <strong>${v}%</strong>
          </div>
          <div class="progress" role="progressbar" aria-valuenow="${v}" aria-valuemin="0" aria-valuemax="100" aria-label="${label}">
            <div class="progress-bar ${progressBarClass(v)}" style="width: ${v}%"></div>
          </div>
        </div>`;
      })
      .join("");

    const recList = document.getElementById("recommendations");
    recList.innerHTML = data.recommendations
      .map((r) => `<li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>${r}</span></li>`)
      .join("");

    const regList = document.getElementById("regulations");
    regList.innerHTML = data.regulationsApplied
      .map((r) => `<span class="regulation-chip">${r.split("—")[0].trim()}</span>`)
      .join("");

    if (placeholder) placeholder.classList.add("d-none");
    results.classList.remove("d-none");
    results.classList.add("results-visible");
    results.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  if (apiBadge) {
    apiBadge.textContent = API_BASE ? t.apiSpring : t.apiClient;
    apiBadge.className = API_BASE ? "badge text-bg-primary" : "badge text-bg-secondary";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const input = readForm();
      const data = await analyze(input);
      render(data, input.projectType);
    } catch {
      showToast(t.error);
    } finally {
      setLoading(false);
    }
  });
})();
