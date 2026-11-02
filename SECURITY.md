# Security policy

## Supported version

Security updates are applied to the current `main` branch and its GitHub Pages deployment. Historical commits and downloaded copies are not maintained separately.

## Report a vulnerability privately

Use [GitHub private vulnerability reporting](https://github.com/faizalrahman-55/frdesignstudioarchitects/security/advisories), or email **frdesignstudioarchitect@gmail.com** with the subject **Website security report**. Please do not disclose an unpatched vulnerability, private information, or credentials in a public issue.

Include the affected URL or file, reproduction steps, expected impact, and browser/version if relevant. Use harmless examples. Do not access another person's data, disrupt availability, or test GitHub's infrastructure. This policy does not authorize testing third-party services or promise a bounty or response deadline.

## Website safeguards

- GitHub Pages serves the production site over HTTPS.
- A browser Content Security Policy limits scripts and styles to this site, blocks inline script execution, network connections from scripts, objects, frames, workers, base URL changes, and form submissions. A no-referrer policy is applied.
- Scripts and images are local; no external JavaScript libraries, trackers, analytics, accounts, database, or payment processing are included.
- The enquiry form prepares an email draft. The visitor reviews and sends it through their own email application; the site does not send it automatically or persist the draft in browser storage.
- Links opening new tabs use `noopener noreferrer`.

These controls reduce risk; they do not guarantee that every vulnerability will be prevented. GitHub Pages manages HTTP response headers, and a meta CSP does not provide a `frame-ancestors` header. Keep future changes within the existing policy and review any added dependency or third-party service.

See [Security & Privacy](https://faizalrahman-55.github.io/frdesignstudioarchitects/security.html) for visitor information and [GitHub security settings](https://github.com/faizalrahman-55/frdesignstudioarchitects/settings/security_analysis) for repository protections.
