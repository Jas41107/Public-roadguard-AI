# RoadGuard AI

RoadGuard AI is a modern academic front-end website for an AI-based vehicle accident risk prediction project. It is designed to present a professional UI for a Random Forest classification project based on road-safety data.

## Project structure

```text
roadguard-ai/
├── index.html
├── prediction.html
├── insights.html
├── about.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── prediction.js
│   └── insights.js
├── assets/
│   └── images/
│       └── placeholder.txt
├── README.md
└── ...
```

## How to run

From the project folder:

```bash
cd "C:\Users\win-11\OneDrive\Desktop\VS C LANGUAGE\roadguard-ai"
python -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/index.html
```

## What each major file does

- `index.html` – Home page with hero section, trust stats, and workflow explanation.
- `prediction.html` – Form for entering driver and road conditions and displaying the prediction result.
- `insights.html` – Model explanation page with Random Forest concept, metric placeholders, and performance visuals.
- `about.html` – Academic project overview, objective, algorithm, dataset, and disclaimer.
- `css/style.css` – Full design system, layout styling, animations, responsive behavior, and glassmorphism theme.
- `js/main.js` – Mobile nav behavior and global page setup.
- `js/prediction.js` – Form interaction, slider synchronization, Demo Mode logic, and backend/API hook.
- `js/insights.js` – Small UI animation setup for insight cards.

## Where the Flask API connects

The prediction page is already prepared to connect to a backend endpoint via:

```js
async function predictRisk(data) {
  const response = await fetch('/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  return await response.json();
}
```

This is implemented in `js/prediction.js`.

The Flask backend should expose a `POST /predict` endpoint that returns a JSON object such as:

```json
{
  "prediction": "High",
  "probability": 0.82
}
```

or another compatible shape handled by the frontend normalization logic.

## Switching from Demo Mode to real model mode

1. Connect the Flask backend and ensure `/predict` is running.
2. Remove or disable the Demo Mode fallback inside `js/prediction.js`.
3. Keep the actual model response shape aligned with the front-end parser.
4. The real backend should replace the simulated risk score calculated in the demo logic.

## Viva explanation

RoadGuard AI is a professional academic interface for a machine-learning project that predicts accident risk using road and driver conditions. The design presents a realistic dashboard experience for a Random Forest-based safety model, while clearly distinguishing between simulated Demo Mode and real model-powered predictions. It is intended for educational and research use and demonstrates how machine learning can be used to improve road safety awareness.
