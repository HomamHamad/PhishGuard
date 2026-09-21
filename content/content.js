function analyzeForms() {
  const passwordFields = document.querySelectorAll('input[type="password"]');

  let externalFormDetected = false;

  passwordFields.forEach((passwordField) => {
    const form = passwordField.closest("form");

    if (form) {
      try {
        const actionUrl = new URL(form.action || window.location.href);

        const pageDomain = getBaseDomain(window.location.hostname);

        const actionDomain = getBaseDomain(actionUrl.hostname);

        if (pageDomain !== actionDomain) {
          externalFormDetected = true;
        }
      } catch {}
    }
  });

  return {
    passwordFields: passwordFields.length,
    externalFormDetected: externalFormDetected,
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeForms") {
    sendResponse(analyzeForms());
  }
});
