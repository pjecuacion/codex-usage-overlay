const elements = {
  remaining: document.querySelector("#remaining"),
  meterFill: document.querySelector("#meterFill"),
  primaryLabel: document.querySelector("#primaryLabel"),
  primaryValue: document.querySelector("#primaryValue"),
  primaryReset: document.querySelector("#primaryReset"),
  secondaryLabel: document.querySelector("#secondaryLabel"),
  secondaryValue: document.querySelector("#secondaryValue"),
  secondaryReset: document.querySelector("#secondaryReset"),
  guidance: document.querySelector("#guidance"),
  guidanceHeadline: document.querySelector("#guidanceHeadline"),
  guidanceDetail: document.querySelector("#guidanceDetail"),
  status: document.querySelector("#status"),
  source: document.querySelector("#source"),
  refresh: document.querySelector("#refresh")
};

async function refresh() {
  elements.status.textContent = "Refreshing...";

  try {
    const snapshot = await window.codexUsage.getSnapshot();
    render(snapshot);
  } catch (error) {
    elements.status.textContent = "Could not read local Codex usage.";
    elements.source.textContent = error.message;
  }
}

function render(snapshot) {
  elements.remaining.textContent = `${snapshot.remainingPercent}%`;
  elements.meterFill.style.width = `${snapshot.remainingPercent}%`;
  renderWindow(elements.primaryLabel, elements.primaryValue, elements.primaryReset, snapshot.windows?.[0]);
  renderWindow(elements.secondaryLabel, elements.secondaryValue, elements.secondaryReset, snapshot.windows?.[1]);
  renderGuidance(snapshot.pacing);
  elements.status.textContent = `${capitalize(snapshot.kind)}, ${snapshot.confidence} confidence`;
  elements.source.textContent = `Source: ${snapshot.source}`;
}

function renderGuidance(pacing) {
  elements.guidance.dataset.action = pacing?.action ?? "unknown";
  elements.guidanceHeadline.textContent = pacing?.headline ?? "Pacing unavailable";
  elements.guidanceDetail.textContent = pacing?.detail ?? "--";
}

function renderWindow(labelEl, valueEl, resetEl, window) {
  labelEl.textContent = window?.label ?? "--";
  valueEl.textContent = window ? `${window.remainingPercent}%` : "--%";
  resetEl.textContent = window?.resetLabel ? `resets ${window.resetLabel}` : "--";
}

function capitalize(value) {
  return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}

elements.refresh.addEventListener("click", refresh);
refresh();
setInterval(refresh, 60_000);
