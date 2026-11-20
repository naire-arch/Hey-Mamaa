# 🌸 Hey, Mamaa

A menstrual cycle and nutrition web app with Kenyan meal plans, by **Waziri**.

## Features
- Cycle logging with phase detection (menstrual, follicular, ovulation, luteal), next-period and fertile-window estimates, symptom log
- Per-phase hormone explanations, diet tips, Do's and Don'ts, medication notes
- Anthropometry (BMI, waist, MUAC) driving Kenyan meal plans by nutrition status, plus supplementation guide
- PCOS guidance and a "my period is late, don't panic" guide
- Rule-based reproductive-health chatbot
- "When to see a dietitian / doctor" section and in-app messaging (demo)
- Entertainment ideas for each phase
- Login with name and phone number; SMS alert preview

## Run locally
No build step. Open `index.html` in a browser, or:

```bash
python3 -m http.server 8000
```

## Deploy on GitHub Pages
1. Push to a GitHub repo's `main` branch.
2. In **Settings → Pages**, set Source to **GitHub Actions**.
3. The included workflow (`.github/workflows/pages.yml`) publishes the site.

## Roadmap (needs a backend)
- Real SMS alerts, e.g. [Africa's Talking](https://africastalking.com)
- Real two-way messaging with dietitians and doctors (auth, database)
- Replace the rule-based chatbot with an LLM-backed one

## Disclaimer
General health education only. It is not a diagnosis or treatment. Consult a qualified health professional.
Data is stored only in the browser (`localStorage`).
