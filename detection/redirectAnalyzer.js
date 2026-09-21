function analyzeRedirectUrl(currentUrl) {
  const url = new URL(currentUrl);

  const redirectParameters = [
    "redirect",
    "redirect_url",
    "redirect_uri",
    "return",
    "return_url",
    "next",
    "url",
  ];

  for (const parameter of redirectParameters) {
    const value = url.searchParams.get(parameter);

    if (value) {
      return {
        detected: true,
        parameter: parameter,
        destination: value,
      };
    }
  }

  return {
    detected: false,
  };
}
function isExternalRedirect(currentUrl, destination) {
  try {
    const current = new URL(currentUrl);
    const target = new URL(destination, currentUrl);

    const currentDomain = getBaseDomain(current.hostname);
    const targetDomain = getBaseDomain(target.hostname);

    return currentDomain !== targetDomain;
  } catch {
    return false;
  }
}
