# construction-compliance-java

**Repository:** [github.com/EnithV/construction-compliance-java](https://github.com/EnithV/construction-compliance-java)  
**Live demo (GitHub Pages):** https://enithv.github.io/construction-compliance-java/

Full-stack **Java** version of the Construction Compliance Analyzer — complementary to the [Python + ML project](https://github.com/EnithV/construction-compliance-analyzer).

| Layer | Stack |
|-------|--------|
| Frontend | HTML5, Bootstrap 5, JavaScript (deployed on GitHub Pages) |
| Backend | Java 17, Spring Boot 3, REST API, Maven, JUnit 5 |

---

## Features

- Compliance score (weighted: technical, administrative, financial, environmental, safety)
- Risk level: Low / Medium / High (rule-based engine aligned with Colombian practice)
- Recommendations and regulation references (NSR-10, Resolution 2115, etc.)
- Bilingual UI: `index.html` (EN) · `index-es.html` (ES)

---

## Run the dashboard (GitHub Pages locally)

Open `index.html` in the browser, or:

```bash
npx serve .
```

The demo uses the **client engine** (`js/engine.js`) — same logic as the Java service.

---

## Run the Spring Boot API

```bash
cd backend
mvn spring-boot:run
```

- Health: `GET http://localhost:8080/api/health`
- Analyze: `POST http://localhost:8080/api/analyze` (JSON body — see `ProjectInput`)

To use the API from the web UI, uncomment in `index.html`:

```javascript
window.COMPLIANCE_API_URL = "http://localhost:8080";
```

---

## Deploy to GitHub Pages

1. Push this repo to `EnithV/construction-compliance-java`.
2. **Settings → Pages →** branch `main`, folder `/ (root)`.
3. URL: https://enithv.github.io/construction-compliance-java/

---

## Project structure

```
construction-compliance-java/
├── index.html, index-es.html   # Dashboard (GitHub Pages)
├── css/, js/
├── backend/                    # Spring Boot REST API
│   └── src/main/java/co/gicelavargas/compliance/
└── README.md
```

---

## Author

**Gicela Vargas** — Full-Stack Java Developer · Civil Engineer
