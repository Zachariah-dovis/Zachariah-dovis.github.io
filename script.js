/* ==========================================================================
   Zachariah Zhang — site behaviour
   Progressive enhancement only: every page is fully readable with JS disabled.
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- year -- */
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------- theorem-style boxes -- */
  /*
   * Article prose marks definitions/theorems with a leading <strong>. We classify
   * each qualifying paragraph so the stylesheet can colour-code it. Matching is
   * on the *first few words* only, so a sentence that merely contains the word
   * "theorem" is never boxed by accident.
   */
  var article = $('.article-content');

  if (article) {
    var RULES = [
      { variant: 'def',    re: /^(Definition|Defintion|Fact|Assumption|Notation|Setup|Axiom|Problem|Question)\b/i },
      { variant: 'thm',    re: /^(Theorem|Lemma|Proposition|Corollary|Claim|Conjecture)\b/i },
      { variant: 'proof',  re: /^(Proof|Proof sketch|Solution|Answer|Derivation)\b/i },
      { variant: 'remark', re: /^(Remark|Remarks|Note|Example|Examples|Intuition|Warning|Recall|Observation)\b/i }
    ];

    $$('p', article).forEach(function (p) {
      // Only paragraphs that open with a bolded label qualify.
      var first = p.firstElementChild;
      if (!first || first.tagName !== 'STRONG') return;

      // Paragraphs that carry a display equation are prose leading into maths, not
      // self-contained statements. Boxing them would wrap a numbered equation in a
      // half-box, so leave them alone.
      if (p.querySelector('.math.display, mjx-container[display="true"]')) return;

      var label = (first.textContent || '').replace(/^[\s\u00a0]+/, '');
      for (var i = 0; i < RULES.length; i += 1) {
        if (RULES[i].re.test(label)) {
          p.classList.add('statement', 'statement--' + RULES[i].variant);
          return;
        }
      }
    });

    /* Heading ids -------------------------------------------------------- */
    // build.mjs already assigns ids; this is a safety net for hand-edited pages.
    var used = {};
    $$('h2, h3, h4', article).forEach(function (h, i) {
      if (!h.id) {
        var base = (h.textContent || '').toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60) || ('section-' + (i + 1));
        var id = base, n = 2;
        while (used[id] || document.getElementById(id)) { id = base + '-' + (n++); }
        h.id = id;
      }
      used[h.id] = true;

      // Permalink affordance for keyboard/AT users.
      if (!$('.heading__anchor', h)) {
        var a = document.createElement('a');
        a.className = 'heading__anchor';
        a.href = '#' + h.id;
        a.setAttribute('aria-label', 'Link to this section');
        a.textContent = '#';
        h.appendChild(a);
      }
    });
  }

  /* --------------------------------------------------- reading progress -- */
  var articleCard = $('[data-article]');
  var bar = $('[data-reading-progress]');

  if (articleCard && bar) {
    var ticking = false;

    var updateProgress = function () {
      ticking = false;
      var rect = articleCard.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var pct;

      if (total <= 0) {
        // Article fits on one screen: full once its top has been reached.
        pct = rect.top <= 72 ? 100 : 0;
      } else {
        pct = ((-rect.top + 72) / total) * 100;
      }
      bar.style.width = Math.max(0, Math.min(100, pct)).toFixed(2) + '%';
    };

    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateProgress();
  }

  /* -------------------------------------------------- active TOC section -- */
  var tocLinks = $$('[data-toc] a[href^="#"]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    var targets = [];

    tocLinks.forEach(function (a) {
      var el = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
      if (!el) return;
      byId[el.id] = a;
      targets.push(el);
    });

    var visible = {};

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });

      var bestId = null, bestRatio = 0;
      targets.forEach(function (el) {
        var r = visible[el.id] || 0;
        if (r > bestRatio) { bestRatio = r; bestId = el.id; }
      });

      // Nothing intersecting: fall back to the last heading scrolled past.
      if (!bestId) {
        var top = 100;
        targets.forEach(function (el) {
          var y = el.getBoundingClientRect().top;
          if (y <= top) bestId = el.id;
        });
      }

      tocLinks.forEach(function (a) { a.classList.remove('is-active'); });
      if (bestId && byId[bestId]) byId[bestId].classList.add('is-active');
    }, { rootMargin: '-88px 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] });

    targets.forEach(function (el) { spy.observe(el); });
  }

  /* ---------------------------------------------- blog filter + search -- */
  var searchInput = $('#post-search');
  var allCards = $$('.post-card');
  var list = $('[data-post-list]');
  var empty = $('[data-empty]');
  var results = $('[data-results]');

  if (allCards.length) {
    var activeTag = 'all';
    var plural = function (n) { return n + (n === 1 ? ' note' : ' notes'); };

    var apply = function () {
      var q = (searchInput ? searchInput.value : '').trim().toLowerCase();
      var shown = 0;

      allCards.forEach(function (card) {
        var matchesTag = activeTag === 'all' || card.dataset.tag === activeTag;
        var haystack = (card.dataset.title || '') + ' ' + (card.dataset.tag || '') + ' '
                     + (card.dataset.blurb || '') + ' ' + (card.textContent || '').toLowerCase();
        var matchesQuery = !q || haystack.indexOf(q) !== -1;
        var ok = matchesTag && matchesQuery;

        card.hidden = !ok;
        if (ok) shown += 1;
      });

      if (empty) empty.hidden = shown !== 0;
      if (list) list.hidden = shown === 0;

      if (results) {
        if (!q && activeTag === 'all') results.textContent = '';
        else results.textContent = 'Showing ' + plural(shown)
          + (activeTag === 'all' ? '' : ' in ' + activeTag)
          + (q ? ' matching \u201c' + q + '\u201d' : '');
      }
    };

    if (searchInput) {
      searchInput.addEventListener('input', apply);

      // "/" focuses search, Escape clears it — but never hijack real typing.
      document.addEventListener('keydown', function (e) {
        var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '');
        if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          searchInput.focus();
        } else if (e.key === 'Escape' && document.activeElement === searchInput) {
          searchInput.value = '';
          searchInput.blur();
          apply();
        }
      });
    }

    $$('.filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeTag = btn.dataset.filter || 'all';
        $$('.filter').forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        if (reduceMotion || !searchInput) { apply(); return; }
        apply();
        if (list) {
          list.style.opacity = '0';
          window.requestAnimationFrame(function () {
            list.style.transition = 'opacity 180ms ease';
            list.style.opacity = '1';
          });
        }
      });
    });

    apply();
  }
})();
