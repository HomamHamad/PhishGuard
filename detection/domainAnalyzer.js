function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2[i - 1] === str1[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1,
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}
function checkLookalikeDomain(hostname) {
  const trustedDomains = [
    "google.com",
    "paypal.com",
    "microsoft.com",
    "amazon.com",
    "apple.com",
    "facebook.com",
    "instagram.com",
  ];

  const currentDomain = getBaseDomain(hostname);

  for (const trustedDomain of trustedDomains) {
    if (currentDomain === trustedDomain) {
      return {
        suspicious: false,
      };
    }

    const distance = levenshteinDistance(currentDomain, trustedDomain);

    if (distance > 0 && distance <= 2) {
      return {
        suspicious: true,
        similarTo: trustedDomain,
        distance: distance,
      };
    }
  }

  return {
    suspicious: false,
  };
}
function getBaseDomain(hostname) {
  const parts = hostname.toLowerCase().split(".");

  const commonSecondLevelDomains = [
    "co.uk",
    "org.uk",
    "ac.uk",
    "com.au",
    "net.au",
    "org.au",
    "co.nz",
    "com.br",
    "com.cn",
    "com.sg",
  ];

  if (parts.length < 2) {
    return hostname;
  }

  const lastTwo = parts.slice(-2).join(".");

  if (commonSecondLevelDomains.includes(lastTwo) && parts.length >= 3) {
    return parts.slice(-3).join(".");
  }

  return lastTwo;
}
function isPunycodeDomain(hostname) {
  const labels = hostname.toLowerCase().split(".");
  return labels.some((label) => label.startsWith("xn--"));
}
function isIpAddress(hostname) {
  const cleanHostname = hostname.replace("[", "").replace("]", "");

  const ipv4Parts = cleanHostname.split(".");

  if (ipv4Parts.length === 4) {
    const validIpv4 = ipv4Parts.every((part) => {
      if (!/^\d+$/.test(part)) {
        return false;
      }

      const number = Number(part);

      return number >= 0 && number <= 255;
    });

    if (validIpv4) {
      return true;
    }
  }

  if (cleanHostname.includes(":")) {
    return true;
  }

  return false;
}
