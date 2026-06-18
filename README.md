# Prabal Piya Portfolio

This is my personal DevOps portfolio website. It is built as a simple static website so the focus stays on clarity, projects, and documentation rather than unnecessary framework complexity.

Live website: https://prabalpiya.com.np

## Purpose

The goal of this portfolio is to show:

- who I am
- what DevOps tools I am learning and practicing
- what projects I have built
- how my projects are documented
- how this portfolio is deployed with a simple CI/CD workflow, without making the main website too crowded

I am currently learning DevOps through hands-on projects around Docker, Kubernetes, cloud infrastructure, CI/CD, automation, and monitoring.

## Deployment flow for the portfolio

```text
Developer pushes code to GitHub
→ GitHub Actions workflow runs
→ Static website files are checked
→ Website is deployed to GitHub Pages
→ Custom domain points to the live website
```

## Folder structure

```text
prabal-portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── script.js
│   ├── images/
│   │   └── profile.png
│   └── screenshots/
├── CNAME
├── index.html
├── README.md
└── .gitignore
```

## How to run locally

Clone the repository:

```bash
git clone https://github.com/PrabalPiya/prabal-portfolio.git
cd prabal-portfolio
```

Open the site directly:

```bash
start index.html
```

Or use a local server:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

## How deployment works

The GitHub Actions workflow is stored in:

```text
.github/workflows/deploy.yml
```

When code is pushed to the `main` branch, the workflow:

1. checks that important static files exist
2. performs a small HTML sanity check
3. uploads the static website files as a GitHub Pages artifact
4. deploys the site to GitHub Pages

This keeps the deployment simple and suitable for a static portfolio website.

## Custom domain

The domain used for this portfolio is:

```text
prabalpiya.com.np
```

The repository includes a `CNAME` file for the custom domain. In GitHub, the domain should also be configured from:

```text
Repository Settings → Pages → Custom domain
```

DNS records must be configured from the domain provider so the domain points to GitHub Pages.


## Common mistakes

### GitHub Pages does not update

Check the Actions tab and confirm the latest workflow run passed.

### Custom domain does not work immediately

DNS changes can take time. Also confirm the custom domain is saved in GitHub Pages settings.

### CSS or JavaScript does not load

Check that the folder paths in `index.html` match the actual file paths:

```html
assets/css/styles.css
assets/js/script.js
```
