# FR Design Studio

Architecture, interiors, and design consultancy portfolio. This is a static HTML, CSS, and JavaScript website with project galleries, an email enquiry draft, an orange drafting cursor, and accessible scroll effects.

## Hosting

Designed for a GitHub Pages project site in a public repository named `frdesignstudioarchitects`. Publish the `main` branch from the repository root. `.nojekyll` preserves the files as authored. The error page uses `/frdesignstudioarchitects/` paths; update those paths if the repository name or hosting base path changes.

All site files and image assets are stored together at the repository root. No build command, package installation, server, or secret is required. The enquiry form opens the visitor’s email app and sends nothing automatically. Website content adds no analytics or advertising scripts. The Security & Privacy page describes GitHub Pages hosting.

## Updates

Edit the HTML, CSS, and JavaScript as needed, preserve the local asset paths, and push to the publishing branch. HTML stylesheet and script URLs include content versions (`?v=…`); refresh those versions when changing an asset and publish the affected HTML pages with it, so returning visitors receive the update. The website’s project imagery, branding, and other creative content remain subject to their respective rights; this repository does not grant a blanket reuse licence for those assets.

## Licence

The website software is licensed under [MIT](LICENSE). Studio branding, designs, images, architectural illustration paths and portfolio content remain reserved; see [COPYRIGHT.md](COPYRIGHT.md).

## Security

See [SECURITY.md](SECURITY.md) for supported versions, private reporting, and the website’s safeguards. No secrets are required for this static site.

## Landing animation

`sketch.js` and `sketch.css` animate a brief construction-line drawing sequence, then reveal the pencil illustration. The replay control repeats the sequence on demand. The full image remains available without JavaScript; reduced-motion visitors receive the static illustration.

## Project and page animation

`motion.js` and `motion.css` provide clipped photo parallax on fine-pointer devices, section reveals, scroll progress, dialog entrances, and subtle interactive feedback. Photo movement runs only in response to events and remains inside the image crop. Parallax and decorative motion respect reduced-motion preferences; touch devices keep stable project photos. Keyboard-focused controls remain visible throughout animations.
