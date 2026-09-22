const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const readableLabel = (value = "") => value
  .replaceAll("-", " ")
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const renderCheck = (check) => `
  <li class="check-row check-row--${escapeHtml(check.status.toLowerCase())}">
    <div class="check-row__heading">
      <span>${escapeHtml(readableLabel(check.label))}</span>
      <span class="status status--${escapeHtml(check.status.toLowerCase())}">${escapeHtml(check.status)}</span>
    </div>
    <strong>${escapeHtml(check.measured ?? "")}</strong>
    <p>${escapeHtml(check.detail ?? "")}</p>
    ${check.confidenceLabel ? `<small class="estimate-label">${escapeHtml(check.confidenceLabel)}</small>` : ""}
    ${check.sourceUrl ? `<small class="source-note"><a href="${escapeHtml(check.sourceUrl)}" target="_blank" rel="noreferrer">Source</a> · checked ${escapeHtml(check.sourceCheckedDate)}</small>` : ""}
  </li>`;

export const renderAnalysisResultMarkup = (result) => `
  <article class="result-card">
    <div class="result-card__topline">
      <p class="eyebrow">Preflight result</p>
      <span class="risk risk--${escapeHtml(result.overallRisk.toLowerCase().replaceAll(" ", "-"))}">${escapeHtml(result.overallRisk)}</span>
    </div>
    <p class="result-card__summary">This is a local risk signal, not an Amazon approval decision.</p>
    <section class="result-section">
      <h3>Technical checks</h3>
      <ul class="check-list">${result.deterministic.map(renderCheck).join("")}</ul>
    </section>
    <section class="result-section">
      <h3>Visual estimates</h3>
      <p class="section-note">Estimated / Best effort. Review the original image and current Seller Central guidance.</p>
      <ul class="check-list">${result.visual.map(renderCheck).join("")}</ul>
    </section>
    <section class="result-section">
      <h3>Manual review</h3>
      <p class="section-note">These checks cannot be reliably determined by this local tool.</p>
      <ul class="check-list">${result.manual.map((item) => `<li class="check-row check-row--manual"><div class="check-row__heading"><span>${escapeHtml(item.label)}</span><span class="status status--manual">Manual review required</span></div></li>`).join("")}</ul>
    </section>
  </article>`;

export const renderAnalysisResult = (container, result) => {
  container.innerHTML = renderAnalysisResultMarkup(result);
};
