function calculateRisk(indicators) {
  let score = 0;

  if (!indicators.https) {
    score += 15;
  }

  if (indicators.ipAddress) {
    score += 25;
  }

  if (indicators.lookalikeDomain) {
    score += 40;
  }
  if (indicators.punycode) {
    score += 20;
  }

  if (indicators.externalForm) {
    score += 25;
  }
  if (indicators.externalRedirect) {
    score += 20;
  }
  let weakUrlSignals = 0;

  if (indicators.longUrl) {
    weakUrlSignals++;
  }

  if (indicators.excessiveSubdomains) {
    weakUrlSignals++;
  }

  if (indicators.heavyEncoding) {
    weakUrlSignals++;
  }

  if (weakUrlSignals === 1) {
    score += 5;
  }

  if (weakUrlSignals === 2) {
    score += 10;
  }

  if (weakUrlSignals >= 3) {
    score += 15;
  }

  if (indicators.atSymbol) {
    score += 15;
  }
  return Math.min(score, 100);
}

function getRiskLevel(score) {
  if (score >= 60) {
    return "HIGH - Multiple high-risk indicators detected";
  }

  if (score >= 30) {
    return "MEDIUM - Suspicious indicators detected";
  }

  return "LOW - Low detected risk";
}
