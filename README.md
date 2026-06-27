# Zachariah Zhang personal website

GitHub Pages-ready static website.

## What is included

- `index.html`: two-column homepage with **About** and **Blog**.
- `posts/*.html`: local HTML versions of the Notion-exported blog posts from **Randomness and Computation**.
- `assets/`: local images copied from the Notion export.
- `styles.css`: visual design and article typography.
- `script.js`: footer year and blog search.
- `.nojekyll`: tells GitHub Pages to serve the files directly.

## Blog posts migrated

- Some Interesting Problems in HF interviews
- Functional Analysis for Markov Chain Mixing Time
- Random Series and SLLN
- Polytopes in High Dimension
- Models in Statistical Physics and some algorithmic correlations
- Some interesting examples related to probability
- Resources on Optimization Theory

## Deploy

Upload all files and folders in this ZIP directly to the root of `Zachariah-dovis.github.io`.

The final structure should look like:

```text
index.html
styles.css
script.js
.nojekyll
posts/
assets/
```

Do not upload the ZIP itself. Unzip it first, then upload the files and folders.

## Editing notes

- Replace the placeholder email in `index.html` when you want to publish a real contact email.
- LaTeX is rendered by MathJax. Inline math and display math are preserved from the Notion Markdown export.
