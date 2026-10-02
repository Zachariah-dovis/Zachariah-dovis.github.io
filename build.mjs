#!/usr/bin/env node
/**
 * build.mjs — regenerates the static pages of Zachariah Zhang's personal site.
 *
 * The article *content* in posts/*.html is treated as the source of truth and is
 * injected verbatim into a new academic/geometric page shell. Running this script
 * is idempotent: every page it writes is derived from the AUTHORED list + the
 * article bodies, so re-running never double-wraps anything.
 *
 *   node build.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SITE = 'https://zachariah-dovis.github.io';

const SITE_NAME = 'Zachariah Zhang';
const BLOG_NAME = 'Randomness and Computation';
const GITHUB = 'https://github.com/Zachariah-dovis';
const EMAIL = 'zachariah.dovis@gmail.com';

/* ------------------------------------------------------------------ *
 * Authoritative post list. Order == blog index order == prev/next order.
 * ------------------------------------------------------------------ */
const AUTHORED = [
  {
    slug: 'some-interesting-problems-in-hf-interviews',
    title: 'Some Interesting Problems in HF Interviews',
    tag: 'Problems',
    blurb: 'Problems I have been asked, or have asked others, in quantitative-research interviews.',
  },
  {
    slug: 'functional-analysis-for-markov-chain-mixing-time',
    title: 'Functional Analysis for Markov Chain Mixing Time',
    tag: 'Markov Chains',
    blurb: 'A compact summary of functional-analytic tools for MCMC: contraction of divergences, log-Sobolev inequalities, heat semigroups, entropy decay, and concentration.',
  },
  {
    slug: 'steins-method-from-characterizations-to-quantitative-approximation',
    title: "Stein's Method: From Characterizations to Quantitative Approximation",
    tag: 'Probability Theory',
    blurb: 'An introduction to characterizing operators, Stein equations, Gaussian and Poisson approximation, exchangeable pairs, bias couplings, and the generator viewpoint.',
  },
  {
    slug: 'random-series-and-slln',
    title: 'Random Series and SLLN',
    tag: 'Probability',
    blurb: 'Convergence of series of random variables: three classical criteria, Kolmogorov’s inequality, and a second proof of the strong law of large numbers.',
  },
  {
    slug: 'polytopes-in-high-dimension',
    title: 'Polytopes in High Dimension',
    tag: 'High Dimension',
    blurb: 'Exact and approximate Carathéodory theorems, covering numbers, and why a polytope with polynomially many vertices is exponentially smaller than a ball.',
  },
  {
    slug: 'models-in-statistical-physics-and-some-algorithmic-correlations',
    title: 'Models in Statistical Physics and Some Algorithmic Correlations',
    tag: 'Statistical Physics',
    blurb: 'A note on spin systems, Ising/Potts models, the hardcore model, proper colorings, and the spectral-independence framework for approximate counting and sampling.',
  },
  {
    slug: 'some-interesting-examples-related-to-probability',
    title: 'Some Interesting Examples Related to Probability',
    tag: 'Probability',
    blurb: 'A collection of counterintuitive examples, kept up to date as I collect more.',
  },
  {
    slug: 'resources-on-optimization-theory',
    title: 'Resources on Optimization Theory',
    tag: 'Optimization',
    blurb: 'First-order methods, cutting-plane methods and interior-point methods, with the references I actually return to.',
  },
].map((p, i) => ({ ...p, index: i, href: `posts/${p.slug}.html` }));

/* ------------------------------------------------------------------ *
 * Small helpers
 * ------------------------------------------------------------------ */
const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function readIfExists(p) {
  if (!existsSync(p)) return null;
  // Strip a trailing newline so the file can be inlined cleanly into <head>.
  return readFileSync(p, 'utf8').replace(/\s+$/, '');
}

/** Publication date of a post body, taken from git history. */
function gitDate(slug) {
  for (const p of [`posts/${slug}.html`, slug]) {
    try {
      const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', p], {
        cwd: ROOT,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
      if (iso) return new Date(iso);
    } catch {
      /* fall through */
    }
  }
  return null;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function fmtDate(d) {
  return d ? `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}` : '';
}

/* ------------------------------------------------------------------ *
 * Favicon + decorative geometry (inline SVG, no extra requests)
 * ------------------------------------------------------------------ */

/** Line-art projection of a high-dimensional polytope — the site's motif. */
function polytopeArt({ className = 'polytope', size = 1 } = {}) {
  // Outer 12-gon ring, mid 6-gon ring, inner 3-gon, annotated vertices.
  const ring = (n, r) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      return [400 + r * Math.cos(a), 400 + r * Math.sin(a)];
    });
  const pts = (arr) => arr.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const outer = ring(12, 330);
  const mid = ring(6, 218);
  const inner = ring(3, 108);

  const spokes = outer
    .map(([x, y], i) => (i % 2 === 0 ? `<line x1="400" y1="400" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>` : ''))
    .join('');

  return `<svg class="${className}" viewBox="0 0 800 800" width="800" height="800" aria-hidden="true" focusable="false">
    <g fill="none" stroke="currentColor" stroke-width="${1.1 * size}" stroke-linejoin="round">
      <polygon points="${pts(outer)}" opacity=".5"/>
      <polygon points="${pts(mid)}" opacity=".8"/>
      <polygon points="${pts(inner)}" opacity=".95"/>
      <g opacity=".28">${spokes}</g>
      <circle cx="400" cy="400" r="330" opacity=".18" stroke-dasharray="3 9"/>
    </g>
    <g fill="currentColor">
      ${mid.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${3.2 * size}"/>`).join('')}
    </g>
  </svg>`;
}

/** Favicon: the same motif reduced to a legible mark at 32px. */
const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#20304F"/>
  <g fill="none" stroke="#E9C08A" stroke-width="2.4" stroke-linejoin="round">
    <polygon points="32,9 51,20 51,43 32,55 13,43 13,20"/>
    <polygon points="32,20 43,26.5 43,39.5 32,46 21,39.5 21,26.5" opacity=".62"/>
  </g>
  <circle cx="32" cy="33" r="3.2" fill="#FFF8EC"/>
</svg>`;

const faviconDataUri = `data:image/svg+xml,${encodeURIComponent(FAVICON_SVG).replace(/'/g, '%27')}`;

/* ------------------------------------------------------------------ *
 * Shared chrome
 * ------------------------------------------------------------------ */
function head({ title, description, cssHref, canonical, jsonLd = null, withMath = false, ogType = 'website' }) {
  const math = withMath
    ? readIfExists(join(ROOT, 'partials', 'mathjax.html')) ?? ''
    : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${escapeAttr(description)}" />
  <meta name="author" content="${SITE_NAME}" />
  <meta name="color-scheme" content="light" />
  <meta name="theme-color" content="#F6F1E6" />
  <link rel="canonical" href="${canonical}" />

  <meta property="og:type" content="${ogType}" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:title" content="${escapeAttr(title)}" />
  <meta property="og:description" content="${escapeAttr(description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta name="twitter:card" content="summary" />

  <link rel="icon" href="${faviconDataUri}" />
  <link rel="apple-touch-icon" href="${faviconDataUri}" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${cssHref}" />
${math}${jsonLd ? `  <script type="application/ld+json">\n${jsonLd}\n  </script>\n` : ''}</head>
`;
}

function topbar({ homeHref, blogHref, aboutHref, isHome = false, isBlog = false, isPost = false }) {
  const link = (href, label, active) =>
    `<a href="${href}"${active ? ' aria-current="page"' : ''}>${label}</a>`;
  return `<body class="page">
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="grain" aria-hidden="true"></div>

  <header class="site-header">
    <div class="site-header__inner">
      <a class="brand" href="${homeHref}" aria-label="${SITE_NAME} — home">
        <span class="brand__mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">
            <polygon points="12,3 19.8,7.5 19.8,16.5 12,21 4.2,16.5 4.2,7.5" />
            <polygon points="12,8 16,10.3 16,14.8 12,17 8,14.8 8,10.3" opacity=".6" />
          </svg>
        </span>
        <span class="brand__text">${SITE_NAME}</span>
      </a>
      <nav class="nav" aria-label="Primary">
        ${link(aboutHref, 'About', isHome)}
        ${link(blogHref, 'Writing', isBlog || isPost)}
        <a class="nav__ext" href="${GITHUB}" target="_blank" rel="noopener">GitHub<span class="sr-only"> (opens in a new tab)</span></a>
      </nav>
    </div>
  </header>
`;
}

function footer({ homeHref, blogHref, scriptHref = 'script.js' }) {
  return `
  <footer class="site-footer">
    <div class="site-footer__inner">
      <p class="site-footer__name">© <span id="year"></span> ${SITE_NAME}</p>
      <nav class="site-footer__nav" aria-label="Footer">
        <a href="${homeHref}">About</a>
        <a href="${blogHref}">Writing</a>
        <a href="${GITHUB}" target="_blank" rel="noopener">GitHub</a>
        <a href="mailto:${EMAIL}">Email</a>
      </nav>
      <p class="site-footer__note">${BLOG_NAME} · notes on high-dimensional phenomena</p>
    </div>
  </footer>

  <script src="${scriptHref}" defer></script>
</body>
</html>
`;
}

/* ------------------------------------------------------------------ *
 * Article body extraction + transformation
 * ------------------------------------------------------------------ */

/** Pull the inner HTML of <div class="article-content">…</div> out of a post. */
function extractContent(html, slug) {
  const marker = html.indexOf('class="article-content"');
  if (marker === -1) return null;
  const open = html.indexOf('>', marker);
  if (open === -1) return null;

  const openTag = html.slice(html.lastIndexOf('<div', marker), open + 1);
  if (!/^<div\b/i.test(openTag)) return null;

  // Depth-scan for the matching </div>, ignoring <div> inside HTML comments.
  let depth = 1;
  let i = open + 1;
  const re = /<div\b[^>]*>|<\/div\s*>/gi;
  re.lastIndex = i;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].slice(0, 2) === '</') {
      depth -= 1;
      if (depth === 0) return html.slice(open + 1, m.index).trim();
    } else {
      depth += 1;
    }
  }
  throw new Error(`Unbalanced <div> in article content of ${slug}`);
}

const slugify = (s, fallback) =>
  s
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/&[a-z]+;|&#\d+;/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || fallback;

const stripTags = (s) =>
  s
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

function readingTime(text) {
  const words = stripTags(text).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 165));
}

/**
 * Add ids to headings (for anchors + scroll-spy), collect a table of contents,
 * and mark the opening paragraph(s) as a lede.
 *
 * This must stay idempotent: buildPost() reads posts/*.html, which is also where
 * this function's output is written, so a previously-generated anchor is removed
 * before a fresh one is appended. Without that, every rebuild would leak another
 * "#" into the table-of-contents label.
 */
function transformContent(content) {
  const toc = [];
  const used = new Set();

  // Drop anchors from any previous run.
  const source = content.replace(
    /\s*<a\b[^>]*class="heading__anchor"[^>]*>[\s\S]*?<\/a>/gi,
    ''
  );

  let out = source.replace(/<h([1-4])([^>]*)>([\s\S]*?)<\/h\1>/gi, (full, lvl, attrs, body) => {
    const text = stripTags(body);
    if (!text) return full;
    let id = '';
    const existing = /\sid\s*=\s*["']([^"']+)["']/i.exec(attrs);
    if (existing) id = existing[1];
    else {
      id = slugify(text, `section-${toc.length + 1}`);
      let n = 2;
      while (used.has(id)) id = `${slugify(text, 'section')}-${n++}`;
    }
    used.add(id);
    if (!existing) attrs = `${attrs} id="${id}"`;
    toc.push({ id, text, level: Number(lvl) });
    return `<h${lvl}${attrs}>${body}<a class="heading__anchor" href="#${id}" aria-label="Link to this section">#</a></h${lvl}>`;
  });

  // A lede exists only when a paragraph genuinely opens the article — i.e. it is
  // the very first block, before any heading, figure, or list.
  if (/^\s*<p\b[^>]*>/i.test(out) && out.slice(0, out.indexOf('>') + 1).indexOf('class=') === -1) {
    out = out.replace(/^(\s*<p\b)/i, '$1 class="article-lede"');
  }

  return { html: out, toc };
}

/* ------------------------------------------------------------------ *
 * Shared pieces for article pages
 * ------------------------------------------------------------------ */
function ribbon() {
  return `      <div class="ribbon" aria-hidden="true"><span class="ribbon__fill" data-reading-progress></span></div>
`;
}

function sidebar({ archiveHrefPrefix = '', toc = [], slug }) {
  const active = (s) => (s === slug ? ' aria-current="true"' : '');
  const archive = AUTHORED.map(
    (p) => `          <li><a href="${p.slug}.html"${active(p.slug)}><span class="archive__dot" aria-hidden="true"></span><span>${p.title}</span></a></li>`
  ).join('\n');

  // A one-entry contents list is worse than none — fall back to the archive alone.
  const tocBlock = toc.length >= 2
    ? `      <nav class="toc" aria-labelledby="toc-title" data-toc>
        <p class="eyebrow" id="toc-title">On this page</p>
        <ul class="toc__list">
${toc.map((t) => `          <li class="toc__item toc__item--h${t.level}"><a href="#${t.id}">${t.text}</a></li>`).join('\n')}
        </ul>
      </nav>
`
    : '';

  return `    <aside class="article-sidebar">
${tocBlock}      <nav class="archive" aria-labelledby="archive-title">
        <p class="eyebrow" id="archive-title">${BLOG_NAME}</p>
        <ul class="archive__list">
${archive}
        </ul>
      </nav>
    </aside>
`;
}

function postNav(slug) {
  const i = AUTHORED.findIndex((p) => p.slug === slug);
  if (i === -1) return '';
  const prev = AUTHORED[i - 1];
  const next = AUTHORED[i + 1];
  const cell = (p, dir) =>
    p
      ? `<a class="pager__link pager__link--${dir}" href="${p.slug}.html" rel="${dir === 'prev' ? 'prev' : 'next'}">
          <span class="pager__dir">${dir === 'prev' ? '← Previous' : 'Next →'}</span>
          <span class="pager__title">${p.title}</span>
        </a>`
      : '<span class="pager__link pager__link--empty" aria-hidden="true"></span>';

  return `      <nav class="pager" aria-label="Post navigation">
${cell(prev, 'prev')}
${cell(next, 'next')}
      </nav>
`;
}

/* ------------------------------------------------------------------ *
 * Page builders
 * ------------------------------------------------------------------ */

function buildIndex() {
  const latest = AUTHORED[5]; // Statistical Physics note — the most recent long-form post.
  const jsonLd = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: SITE_NAME,
      url: `${SITE}/`,
      email: `mailto:${EMAIL}`,
      sameAs: [GITHUB],
      description:
        'Quantitative researcher working on high-dimensional phenomena in algorithms, probability, machine learning, and convex geometry.',
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'Peking University' },
    },
    null,
    2
  );

  return (
    head({
      title: `${SITE_NAME} — Probability, Algorithms & High Dimension`,
      description:
        'Zachariah Zhang — quantitative researcher interested in high-dimensional phenomena in algorithms, probability, machine learning, and convex geometry. Author of the notes blog Randomness and Computation.',
      cssHref: 'styles.css',
      canonical: `${SITE}/`,
      jsonLd,
    }) +
    topbar({ homeHref: 'index.html', blogHref: 'blog.html', aboutHref: '#about', isHome: true }) +
    `
  <main id="main">
    <section class="hero" id="about" aria-labelledby="hero-title">
      <div class="hero__art" aria-hidden="true">${polytopeArt({ className: 'polytope polytope--hero' })}</div>
      <div class="hero__inner">
        <p class="eyebrow">Quantitative Research · Probability · Algorithms</p>
        <h1 class="hero__title" id="hero-title">${SITE_NAME}</h1>
        <p class="hero__lede">
          I am interested in the <em>high-dimensional phenomenon</em> in algorithms, probability,
          machine learning, and convex geometry.
        </p>
        <p class="hero__body">
          I recently graduated from Peking University with a Bachelor of Science degree, and I am
          currently working as a junior quantitative researcher at Goku Tech.
        </p>

        <ul class="chips" aria-label="Research interests">
          <li class="chip">High-dimensional phenomena</li>
          <li class="chip">Probability theory</li>
          <li class="chip">Algorithms</li>
          <li class="chip">Convex geometry</li>
          <li class="chip">Machine learning</li>
        </ul>

        <div class="hero__actions">
          <a class="btn btn--primary" href="blog.html">
            Read the notes
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
          </a>
          <a class="btn" href="mailto:${EMAIL}">Email</a>
          <a class="btn btn--ghost" href="${GITHUB}" target="_blank" rel="noopener">GitHub</a>
        </div>
      </div>
    </section>

    <section class="home-section" aria-labelledby="latest-title">
      <div class="home-section__head">
        <h2 class="section-title" id="latest-title">Recent notes</h2>
        <a class="section-more" href="blog.html">All ${AUTHORED.length} notes <span aria-hidden="true">→</span></a>
      </div>
      <ul class="latest">
${AUTHORED.slice(2, 5)
  .map(
    (p) => `        <li class="latest__item">
          <a class="latest__link" href="${p.href}">
            <span class="latest__tag">${p.tag}</span>
            <span class="latest__title">${p.title}</span>
            <span class="latest__blurb">${p.blurb}</span>
            <span class="latest__go" aria-hidden="true">Read →</span>
          </a>
        </li>`
  )
  .join('\n')}
      </ul>
    </section>

    <section class="home-section" aria-labelledby="work-title">
      <div class="home-section__head">
        <h2 class="section-title" id="work-title">Elsewhere</h2>
      </div>
      <ul class="elsewhere">
        <li><a href="${GITHUB}" target="_blank" rel="noopener"><span>GitHub</span><span class="elsewhere__note">Code and notes</span></a></li>
        <li><a href="${latest.href}"><span>${BLOG_NAME}</span><span class="elsewhere__note">Writing on high dimension</span></a></li>
        <li><a href="mailto:${EMAIL}"><span>${EMAIL}</span><span class="elsewhere__note">Always happy to talk maths</span></a></li>
      </ul>
    </section>
  </main>
` +
    footer({ homeHref: 'index.html', blogHref: 'blog.html' })
  );
}

function buildBlog() {
  const total = AUTHORED.length;
  const jsonLd = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: BLOG_NAME,
      url: `${SITE}/blog.html`,
      author: { '@type': 'Person', name: SITE_NAME },
      blogPost: AUTHORED.map((p) => ({
        '@type': 'BlogPosting',
        headline: p.title,
        url: `${SITE}/${p.href}`,
        keywords: p.tag,
      })),
    },
    null,
    2
  );

  const tags = [...new Set(AUTHORED.map((p) => p.tag))];

  return (
    head({
      title: `Writing · ${BLOG_NAME} · ${SITE_NAME}`,
      description: `Notes on high-dimensional phenomena, probability theory, Markov chains, statistical physics, convex geometry, and optimization. ${total} articles and counting.`,
      cssHref: 'styles.css',
      canonical: `${SITE}/blog.html`,
      jsonLd,
      ogType: 'website',
    }) +
    topbar({ homeHref: 'index.html', blogHref: 'blog.html', aboutHref: 'index.html#about', isBlog: true }) +
    `
  <main id="main" class="shell">
    <header class="page-head">
      <div class="page-head__art" aria-hidden="true">${polytopeArt({ className: 'polytope polytope--mark', size: 1.6 })}</div>
      <p class="eyebrow">Notes &amp; Writing</p>
      <h1 class="page-title">${BLOG_NAME}</h1>
      <p class="page-lede">
        Working notes on high-dimensional phenomena and the mathematics around them — probability,
        spectral methods, convex geometry, and the algorithms that connect them. Written to be
        re-read.
      </p>
      <p class="page-meta">${total} notes · updated as I learn</p>
    </header>

    <section class="post-index" aria-labelledby="index-title">
      <h2 class="sr-only" id="index-title">All notes</h2>

      <div class="filters" role="group" aria-label="Filter notes by topic">
        <button class="filter is-active" type="button" data-filter="all" aria-pressed="true">All<span class="filter__count">${total}</span></button>
${tags
  .map((t) => {
    const n = AUTHORED.filter((p) => p.tag === t).length;
    return `        <button class="filter" type="button" data-filter="${escapeAttr(t)}" aria-pressed="false">${t}<span class="filter__count">${n}</span></button>`;
  })
  .join('\n')}
      </div>

      <label class="search" for="post-search">
        <span class="sr-only">Search notes</span>
        <svg class="search__icon" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 4 4"/></svg>
        <input id="post-search" class="search__input" type="search" placeholder="Search by title, topic, or keyword…" autocomplete="off" />
        <kbd class="search__hint" aria-hidden="true">/</kbd>
      </label>

      <p class="results" role="status" aria-live="polite" data-results></p>

      <ol class="post-list" data-post-list>
${AUTHORED.map((p) => {
  const d = gitDate(p.slug);
  return `        <li class="post-card" data-tag="${escapeAttr(p.tag)}" data-title="${escapeAttr(p.title.toLowerCase())}" data-blurb="${escapeAttr(p.blurb.toLowerCase())}">
          <a class="post-card__link" href="${p.href}">
            <span class="post-card__num" aria-hidden="true">${String(p.index + 1).padStart(2, '0')}</span>
            <span class="post-card__main">
              <span class="post-card__meta">
                <span class="post-card__tag">${p.tag}</span>
                ${d ? `<span class="post-card__sep" aria-hidden="true">·</span><span class="post-card__date">${fmtDate(d)}</span>` : ''}
              </span>
              <span class="post-card__title">${p.title}</span>
              <span class="post-card__blurb">${p.blurb}</span>
            </span>
            <span class="post-card__go" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
            </span>
          </a>
        </li>`;
}).join('\n')}
      </ol>

      <p class="post-list__empty" data-empty hidden>No notes match that search.</p>
    </section>
  </main>
` +
    footer({ homeHref: 'index.html', blogHref: 'blog.html' })
  );
}

function buildPost(slug) {
  const src = readFileSync(join(ROOT, 'posts', `${slug}.html`), 'utf8');
  const meta = AUTHORED.find((p) => p.slug === slug);
  const rawContent = extractContent(src, slug);
  if (!rawContent) throw new Error(`No article content found in posts/${slug}.html`);

  const { html: content, toc } = transformContent(rawContent);
  const descMatch = /<meta\s+name="description"\s+content="([^"]*)"/i.exec(src);
  const description = descMatch ? descMatch[1].replace(/&quot;/g, '"') : meta.blurb;
  const minutes = readingTime(content);
  const d = gitDate(slug);

  const jsonLd = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: meta.title,
      description,
      url: `${SITE}/${meta.href}`,
      author: { '@type': 'Person', name: SITE_NAME, url: `${SITE}/` },
      publisher: { '@type': 'Person', name: SITE_NAME },
      keywords: meta.tag,
      ...(d ? { datePublished: d.toISOString().slice(0, 10) } : {}),
      ...(toc.length ? { articleSection: toc.filter((t) => t.level === 2).map((t) => t.text) } : {}),
    },
    null,
    2
  );

  return (
    head({
      title: `${meta.title} · ${SITE_NAME}`,
      description,
      cssHref: '../styles.css',
      canonical: `${SITE}/${meta.href}`,
      jsonLd,
      withMath: true,
      ogType: 'article',
    }) +
    topbar({
      homeHref: '../index.html',
      blogHref: '../blog.html',
      aboutHref: '../index.html#about',
      isPost: true,
    }) +
    `
  <main id="main" class="shell">
    <div class="article-shell">
      <article class="article-card" data-article data-post="${slug}">
${ribbon()}        <a class="back-link" href="../blog.html">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13 8H3M7 4 3 8l4 4"/></svg>
          All notes
        </a>

        <header class="article-header">
          <p class="eyebrow">${meta.tag}</p>
          <h1 class="article-title">${meta.title}</h1>
          <p class="article-byline">
            <span>${SITE_NAME}</span>
            ${d ? `<span class="dot" aria-hidden="true"></span><time datetime="${d.toISOString().slice(0, 10)}">${fmtDate(d)}</time>` : ''}
            <span class="dot" aria-hidden="true"></span><span>${minutes} min read</span>
          </p>
        </header>

        <div class="article-content">
${content}
        </div>

${postNav(slug)}      </article>
${sidebar({ toc, slug })}    </div>
  </main>
` +
    footer({ homeHref: '../index.html', blogHref: '../blog.html', scriptHref: '../script.js' })
  );
}

/* ------------------------------------------------------------------ *
 * Write
 * ------------------------------------------------------------------ */
const written = [];

function emit(rel, contents) {
  writeFileSync(join(ROOT, rel), contents);
  written.push(rel);
}

emit('index.html', buildIndex());
emit('blog.html', buildBlog());
for (const p of AUTHORED) emit(`posts/${p.slug}.html`, buildPost(p.slug));

console.log(`✓ rebuilt ${written.length} pages:`);
for (const f of written) console.log(`  · ${f}`);
console.log(`\n  Articles processed: ${AUTHORED.length}`);
