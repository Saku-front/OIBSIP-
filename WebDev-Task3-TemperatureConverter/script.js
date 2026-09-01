const form = document.getElementById("converterForm");
const temperatureInput = document.getElementById("temperature");
const unitSelect = document.getElementById("unit");
const inputSuffix = document.getElementById("inputSuffix");
const inputError = document.getElementById("inputError");
const status = document.getElementById("status");

const results = {
  C: document.getElementById("celsiusResult"),
  F: document.getElementById("fahrenheitResult"),
  K: document.getElementById("kelvinResult")
};

const symbols = { C: "°C", F: "°F", K: "K" };
const names = { C: "Celsius", F: "Fahrenheit", K: "Kelvin" };

function formatNumber(value) {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) < 0.0000001) value = 0;
  return Number(value.toFixed(2)).toLocaleString(undefined, {
    maximumFractionDigits: 2
  });
}

function setError(message) {
  inputError.textContent = message;
  temperatureInput.setCustomValidity(message || "");
  status.classList.toggle("error-state", Boolean(message));
  status.querySelector("span:last-child").textContent =
    message ? "Please check your temperature" : "Ready for a temperature";
}

function validate() {
  const raw = temperatureInput.value.trim();
  const unit = unitSelect.value;

  if (!raw) {
    setError("Please enter a temperature.");
    return null;
  }

  const value = Number(raw);
  if (!Number.isFinite(value)) {
    setError("Please enter a valid numeric temperature.");
    return null;
  }

  // Absolute zero is -273.15 °C, regardless of the selected input unit.
  const celsius = unit === "C"
    ? value
    : unit === "F"
      ? (value - 32) * 5 / 9
      : value - 273.15;

  if (celsius < -273.15) {
    setError(`That is below absolute zero. ${names[unit]} cannot be lower than ${formatNumber(
      unit === "C" ? -273.15 : unit === "F" ? -459.67 : 0
    )}${symbols[unit]}.`);
    return null;
  }

  setError("");
  return { value, celsius };
}

function convert() {
  const data = validate();
  if (!data) {
    Object.values(results).forEach(el => el.textContent = "—");
    return;
  }

  const { celsius } = data;
  const fahrenheit = celsius * 9 / 5 + 32;
  const kelvin = celsius + 273.15;

  results.C.textContent = `${formatNumber(celsius)} °C`;
  results.F.textContent = `${formatNumber(fahrenheit)} °F`;
  results.K.textContent = `${formatNumber(kelvin)} K`;

  status.querySelector("span:last-child").textContent =
    `Converted from ${formatNumber(data.value)} ${symbols[unitSelect.value]}`;

  document.querySelectorAll(".result-card").forEach(card => {
    card.classList.remove("pop");
    void card.offsetWidth;
    card.classList.add("pop");
  });
}

unitSelect.addEventListener("change", () => {
  inputSuffix.textContent = symbols[unitSelect.value];
  if (temperatureInput.value) validate();
});

temperatureInput.addEventListener("input", () => {
  // Real-time validation, but calculations happen only on button click.
  if (temperatureInput.value) validate();
  else setError("");
});

form.addEventListener("submit", event => {
  event.preventDefault();
  convert();
});

temperatureInput.addEventListener("keydown", event => {
  if (event.key === "Enter") convert();
});
