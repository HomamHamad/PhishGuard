# 🛡️ PhishGuard

PhishGuard is a Chrome extension that analyzes the active webpage for common phishing indicators and provides an explainable risk score.

The project uses multiple browser-side heuristics to help users identify potentially suspicious websites while keeping the analysis local.

## Features

- HTTPS connection analysis
- IP-based hostname detection
- Lookalike domain detection using Levenshtein distance
- Punycode domain detection
- Password form destination analysis
- Redirect parameter analysis
- Suspicious URL pattern detection
- Explainable risk scoring from 0 to 100
- LOW, MEDIUM, and HIGH risk levels
- Visual warnings for detected indicators

## Detection Techniques

PhishGuard evaluates several signals:

### Domain Analysis

Checks for:
- IP addresses used instead of domain names
- Domains similar to known trusted domains
- Punycode-encoded domain labels

### URL Analysis

Checks for:
- Unusually long URLs
- Excessive subdomains
- URL credentials
- Heavy URL encoding

### Form Analysis

Detects password fields and checks whether a credential form submits to a different domain.

### Redirect Analysis

Checks common redirect-related URL parameters and identifies destinations on different domains.

## Risk Scoring

Each detected indicator contributes to an overall risk score.

High-confidence indicators receive more weight, while weaker URL indicators are grouped to reduce false positives.

The final score is classified as:

- LOW: 0–29
- MEDIUM: 30–59
- HIGH: 60–100

## Privacy

PhishGuard performs its current analysis locally in the browser and does not send analyzed URLs or form information to an external server.

## Installation

1. Download or clone this repository.
2. Open Google Chrome.
3. Navigate to `chrome://extensions`.
4. Enable **Developer mode**.
5. Click **Load unpacked**.
6. Select the PhishGuard project folder.
7. Open a website and click the PhishGuard extension icon to analyze the page.

## Project Structure

```text
PhishGuard/
├── content/
│   └── content.js
├── detection/
│   ├── domainAnalyzer.js
│   ├── redirectAnalyzer.js
│   ├── riskEngine.js
│   └── urlAnalyzer.js
├── popup/
│   ├── popup.css
│   ├── popup.html
│   └── popup.js
├── manifest.json
└── README.md
```

## Limitations

PhishGuard uses heuristic detection. A LOW risk score does not guarantee that a website is safe, and a higher score does not prove that a website is malicious.

The current version uses a limited trusted-domain list and partial base-domain handling. Redirect analysis currently focuses on redirect-related URL parameters rather than complete browser navigation chains.

## Roadmap

- Improve registrable-domain detection
- Expand and improve lookalike-domain detection
- Add automated tests
- Improve redirect analysis
- Explore automatic background analysis and proactive warnings
- Prepare the extension for Chrome Web Store requirements

## Disclaimer

PhishGuard is an educational cybersecurity project. Its results should be treated as risk indicators, not as a guarantee that a website is safe or malicious.