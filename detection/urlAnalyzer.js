function analyzeUrlLength(url) {
  const maxLength = 100;

  if (url.length > maxLength) {
    return {
      suspicious: true,
      length: url.length,
    };
  }

  return {
    suspicious: false,
    length: url.length,
  };
}
function analyzeSubdomains(url) {
  const hostname = new URL(url).hostname;
  const parts = hostname.split(".");

  const subdomainCount = Math.max(parts.length - 2, 0);

  if (subdomainCount > 2) {
    return {
      suspicious: true,
      count: subdomainCount,
    };
  }

  return {
    suspicious: false,
    count: subdomainCount,
  };
}
function analyzeAtSymbol(url) {
  if (url.includes("@")) {
    return {
      suspicious: true,
    };
  }

  return {
    suspicious: false,
  };
}
function analyzeUrlEncoding(url) {
  const encodedParts = url.match(/%[0-9A-Fa-f]{2}/g) || [];

  if (encodedParts.length >= 3) {
    return {
      suspicious: true,
      count: encodedParts.length,
    };
  }

  return {
    suspicious: false,
    count: encodedParts.length,
  };
}
