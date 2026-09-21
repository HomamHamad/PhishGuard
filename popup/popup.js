function setStatus(id, message, type) {
  const element = document.getElementById(id);

  element.textContent = message;

  element.classList.remove(
    "status-safe",
    "status-warning",
    "status-danger",
    "status-info",
  );

  element.classList.add("status-" + type);
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const currentTab = tabs[0];

  if (!currentTab || !currentTab.url) {
    document.getElementById("current-url").textContent =
      "Unable to analyze this page";

    setStatus("form-status", "ⓘ Form analysis unavailable", "info");

    document.getElementById("risk-score").textContent = "Risk Score: --/100";

    document.getElementById("risk-level").textContent =
      "Risk Level: Unavailable";

    return;
  }

  const currentUrl = currentTab.url;

  document.getElementById("current-url").textContent = currentUrl;

  let urlObject;

  try {
    urlObject = new URL(currentUrl);
  } catch {
    document.getElementById("current-url").textContent =
      "Unable to analyze this page";

    document.getElementById("risk-score").textContent = "Risk Score: --/100";

    document.getElementById("risk-level").textContent =
      "Risk Level: Unavailable";

    return;
  }

  if (urlObject.protocol !== "http:" && urlObject.protocol !== "https:") {
    setStatus("https-status", "ⓘ Unsupported page", "info");

    setStatus("ip-status", "ⓘ Domain analysis unavailable", "info");

    setStatus("domain-status", "ⓘ Lookalike analysis unavailable", "info");

    setStatus("punycode-status", "ⓘ Punycode analysis unavailable", "info");

    setStatus("form-status", "ⓘ Form analysis unavailable", "info");

    setStatus("redirect-status", "ⓘ Redirect analysis unavailable", "info");

    document.getElementById("risk-score").textContent = "Risk Score: --/100";

    document.getElementById("risk-level").textContent =
      "Risk Level: Unavailable";

    return;
  }

  const hostname = urlObject.hostname;
  const isHttps = urlObject.protocol === "https:";

  if (isHttps) {
    setStatus("https-status", "✓ Secure HTTPS connection", "safe");
  } else {
    setStatus("https-status", "⚠ No HTTPS detected", "warning");
  }

  const ipAddressDetected = isIpAddress(hostname);

  if (ipAddressDetected) {
    setStatus("ip-status", "⚠ IP address used instead of domain", "warning");
  } else {
    setStatus("ip-status", "✓ Normal domain detected", "safe");
  }

  const lookalikeResult = checkLookalikeDomain(hostname);

  if (lookalikeResult.suspicious) {
    setStatus(
      "domain-status",
      "⚠ Possible lookalike domain. Similar to: " + lookalikeResult.similarTo,
      "danger",
    );
  } else {
    setStatus("domain-status", "✓ No lookalike domain detected", "safe");
  }

  const punycodeDetected = isPunycodeDomain(hostname);

  if (punycodeDetected) {
    setStatus("punycode-status", "⚠ Punycode domain detected", "warning");
  } else {
    setStatus("punycode-status", "✓ No Punycode detected", "safe");
  }

  const redirectResult = analyzeRedirectUrl(currentUrl);

  let externalRedirect = false;

  if (redirectResult.detected) {
    externalRedirect = isExternalRedirect(
      currentUrl,
      redirectResult.destination,
    );

    if (externalRedirect) {
      setStatus("redirect-status", "⚠ External redirect detected", "warning");
    } else {
      setStatus("redirect-status", "ⓘ Same-domain redirect detected", "info");
    }
  } else {
    setStatus("redirect-status", "✓ No suspicious redirect detected", "safe");
  }

  const urlLengthResult = analyzeUrlLength(currentUrl);
  const subdomainResult = analyzeSubdomains(currentUrl);
  const atSymbolResult = analyzeAtSymbol(currentUrl);
  const encodingResult = analyzeUrlEncoding(currentUrl);

  chrome.tabs.sendMessage(
    currentTab.id,
    { action: "analyzeForms" },
    function (response) {
      if (chrome.runtime.lastError) {
        response = null;
      }

      if (response && response.passwordFields > 0) {
        if (response.externalFormDetected) {
          setStatus(
            "form-status",
            "⚠ Password form submits to a different domain",
            "danger",
          );
        } else {
          setStatus(
            "form-status",
            "✓ Password form submits to the same domain",
            "safe",
          );
        }
      } else if (response) {
        setStatus("form-status", "✓ No password form detected", "safe");
      } else {
        setStatus("form-status", "ⓘ Form analysis unavailable", "info");
      }

      const indicators = {
        https: isHttps,
        ipAddress: ipAddressDetected,
        lookalikeDomain: lookalikeResult.suspicious,
        punycode: punycodeDetected,
        externalForm: response ? response.externalFormDetected : false,
        externalRedirect: externalRedirect,
        longUrl: urlLengthResult.suspicious,
        excessiveSubdomains: subdomainResult.suspicious,
        atSymbol: atSymbolResult.suspicious,
        heavyEncoding: encodingResult.suspicious,
      };

      const riskScore = calculateRisk(indicators);
      const riskLevel = getRiskLevel(riskScore);

      document.getElementById("risk-score").textContent =
        "Risk Score: " + riskScore + "/100";

      const riskLevelElement = document.getElementById("risk-level");

      riskLevelElement.textContent = "Risk Level: " + riskLevel;

      riskLevelElement.classList.remove("risk-low", "risk-medium", "risk-high");

      if (riskScore >= 60) {
        riskLevelElement.classList.add("risk-high");
      } else if (riskScore >= 30) {
        riskLevelElement.classList.add("risk-medium");
      } else {
        riskLevelElement.classList.add("risk-low");
      }

      const riskBarFill = document.getElementById("risk-bar-fill");

      riskBarFill.style.width = riskScore + "%";

      if (riskScore >= 60) {
        riskBarFill.style.background = "#ef4444";
      } else if (riskScore >= 30) {
        riskBarFill.style.background = "#f59e0b";
      } else {
        riskBarFill.style.background = "#22c55e";
      }

      const warningBox = document.getElementById("warning-box");

      if (riskScore >= 60) {
        warningBox.style.display = "block";
        warningBox.textContent =
          "⚠ Warning: Multiple high-risk phishing indicators detected.";
      } else {
        warningBox.style.display = "none";
      }
    },
  );
});
