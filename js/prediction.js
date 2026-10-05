const form = document.getElementById('risk-form');

if (form) {
  const ageInput = document.getElementById('driver-age');
  const speedInput = document.getElementById('vehicle-speed');
  const ageValue = document.getElementById('driver-age-value');
  const speedValue = document.getElementById('vehicle-speed-value');
  const finalRisk = document.getElementById('final-risk');
  const confidenceValue = document.getElementById('confidence-value');
  const displayAge = document.getElementById('display-age');
  const displaySpeed = document.getElementById('display-speed');
  const displayWeather = document.getElementById('display-weather');
  const riskBadge = document.getElementById('risk-level-badge');
  const meterFill = document.getElementById('meter-fill');

  const updateSliderDisplay = () => {
    if (ageInput && ageValue) {
      ageValue.textContent = `${ageInput.value} years`;
    }

    if (speedInput && speedValue) {
      speedValue.textContent = `${speedInput.value} km/h`;
    }
  };

  ageInput.addEventListener('input', updateSliderDisplay);
  speedInput.addEventListener('input', updateSliderDisplay);
  updateSliderDisplay();

  const setRiskState = (label, percent, textColor = '#00D4FF') => {
    finalRisk.textContent = label;
    confidenceValue.textContent = `${percent}%`;
    riskBadge.textContent = label;
    riskBadge.style.borderColor = textColor;
    riskBadge.style.color = textColor;
    meterFill.style.width = `${percent}%`;
    meterFill.style.background = `linear-gradient(90deg, #4ADE80 0%, #FACC15 55%, #EF4444 100%)`;
  };

  const getDemoPrediction = (inputData) => {
    const age = Number(inputData.driverAge || 24);
    const speed = Number(inputData.vehicleSpeed || 72);
    const weather = String(inputData.weather || 'Clear');

    let riskScore = 0;
    riskScore += age > 60 ? 22 : age > 40 ? 14 : 8;
    riskScore += speed > 100 ? 30 : speed > 70 ? 18 : 8;
    riskScore += weather === 'Rainy' ? 18 : weather === 'Foggy' ? 16 : weather === 'Snowy' ? 20 : 6;

    let label = 'LOW';
    let confidence = 64;

    if (riskScore > 55) {
      label = 'HIGH';
      confidence = 88;
    } else if (riskScore > 32) {
      label = 'MEDIUM';
      confidence = 76;
    }

    return {
      prediction: label,
      probability: confidence,
      riskScore,
      note: 'Demo Mode: This result is simulated for UI demonstration. Connect the Random Forest model for real predictions.'
    };
  };

  const normalizeResponse = (response) => {
    if (response && response.prediction) {
      return {
        prediction: response.prediction,
        probability: Number(response.probability || response.confidence || 0) * 100 || 0,
      };
    }

    if (response && response.risk_label) {
      return {
        prediction: response.risk_label,
        probability: Number(response.confidence || 0),
      };
    }

    return null;
  };

  const setLoadingState = () => {
    finalRisk.textContent = 'Loading...';
    confidenceValue.textContent = '--';
    riskBadge.textContent = 'Processing';
    riskBadge.style.color = '#FACC15';
    riskBadge.style.borderColor = '#FACC15';
    meterFill.style.width = '0%';
  };

  async function predictRisk(data) {
    const response = await fetch('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Unable to connect to the AI model. Please make sure the backend is running.');
    }

    return response.json();
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setLoadingState();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const safeAge = Number(payload.driverAge || 24);
    const safeSpeed = Number(payload.vehicleSpeed || 72);
    const safeWeather = payload.weather || 'Clear';

    displayAge.textContent = `${safeAge} years`;
    displaySpeed.textContent = `${safeSpeed} km/h`;
    displayWeather.textContent = safeWeather;

    try {
      const response = await predictRisk(payload).catch(() => {
        const demoResult = getDemoPrediction(payload);
        let color = '#4ADE80';
        if (demoResult.prediction === 'MEDIUM') color = '#FACC15';
        if (demoResult.prediction === 'HIGH') color = '#EF4444';

        setRiskState(demoResult.prediction, demoResult.probability, color);
        return { demo: true };
      });

      if (response && response.demo) {
        return;
      }

      const normalized = normalizeResponse(response);
      if (!normalized) {
        throw new Error('The backend response format was not recognized.');
      }

      let color = '#4ADE80';
      if (normalized.prediction.toLowerCase().includes('medium')) color = '#FACC15';
      if (normalized.prediction.toLowerCase().includes('high')) color = '#EF4444';

      setRiskState(normalized.prediction, Math.min(Math.max(Number(normalized.probability || 0), 0), 100), color);
    } catch (error) {
      const message = error.message || 'Unable to connect to the AI model. Please make sure the backend is running.';
      finalRisk.textContent = 'Demo Result';
      riskBadge.textContent = 'Demo Mode';
      riskBadge.style.color = '#00D4FF';
      riskBadge.style.borderColor = '#00D4FF';
      confidenceValue.textContent = 'Simulated';
      displayWeather.textContent = payload.weather || 'Clear';
      meterFill.style.width = '65%';
      meterFill.style.background = 'linear-gradient(90deg, #4ADE80 0%, #FACC15 55%, #EF4444 100%)';
      alert(message);
    }
  });
}
