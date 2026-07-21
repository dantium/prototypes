/* ============================================================
   WMF shop prototype — PDP runtime (product.html)
   app.js loads the catalog and calls window.renderPDP(api) once
   it arrives. Everything product-specific renders from the
   catalog; the marketing sections are Figma example content and
   only show for the family they describe (Profi Resist).
   ============================================================ */
(function () {
  'use strict';

  /* Figma lifestyle gallery for the Profi Resist family (the design's
     example product). Other products show their packshot + shared shot. */
  var HERO_SERIES = 'Profi Resist';
  var HERO_GALLERY = [
    { src: 'assets/pdp/gallery-steak.jpg',     kind: 'life', video: true, alt: 'Steak searing in the pan on a gas hob' },
    { src: 'assets/pdp/gallery-honeycomb.jpg', kind: 'life', alt: 'Honeycomb structure close-up' },
    { src: 'assets/pdp/gallery-3ply.jpg',      kind: 'life', alt: '3-ply construction' },
    { src: 'assets/pdp/gallery-clean.jpg',     kind: 'life', alt: 'Easy to clean' },
    { src: 'assets/pdp/gallery-heat.jpg',      kind: 'life', alt: 'Fast, even heating' }
  ];

  var SIZE_HINTS = { '20 cm': '1 – 2 people', '24 cm': '2 – 4 people', '28 cm': '4 – 6 people' };

  /* Read-more description for the honeycomb hero (Profi Resist): teaser collapsed,
     intro + benefit bullets expanded. Rich HTML — rendered, not escaped. */
  var DESC_HERO = {
    teaser: 'Get professional results in your kitchen with our most advanced frying pan yet.',
    full:
      '<p>Get professional results in your kitchen with our most advanced frying pan yet.</p>' +
      '<p>Designed for confident searing this hybrid frying pan combines fast, even heat with protected nonstick performance built to last.</p>' +
      '<ul class="bb-benefits">' +
        '<li><b>Intense searing:</b> Delivers crisp results at high heat with easy release.</li>' +
        '<li><b>Pro-grade multi-layer build:</b> Aluminium core with stainless-steel interior and durable chrome steel exterior for fast, even heat.</li>' +
        '<li><b>10-year warranty:</b> Hard-wearing materials and construction, backed by a 10-year warranty for peace of mind.</li>' +
        '<li><b>Protected nonstick durability:</b> PermaDur non-stick coating reinforced by a raised Sear Protect® honeycomb structure to resist scratching and sticking.</li>' +
        '<li><b>Effortless serving:</b> Coated pouring rim helps food slide cleanly onto the plate, plus drip-free pouring of liquids.</li>' +
        '<li><b>Stovetop-to-oven ready:</b> Suitable for all hob types and oven use, with a heat-reducing handle for comfortable control.</li>' +
      '</ul>'
  };

  /* buy-box accessory slider — example items from the Figma mock */
  var ACCESSORIES = [
    { img: 'assets/pdp/acc-spatula.jpg', name: 'Profi Plus spatula, 32 cm', price: 22.99 },
    { img: 'assets/pdp/acc-guard.jpg', name: 'Splash guard for pans, 20, 24 and 28 cm', price: 29.99 },
    { img: 'assets/pdp/acc-mat.jpg', name: 'Pan protection mat set, 2-piece, 38 cm', price: 6.99 },
    { img: 'assets/pdp/acc-tongs.jpg', name: 'BBQ serving tongs', price: 24.99 }
  ];

  /* the Size Guide table (rim diameter; hints match the size chips) */
  var SIZE_GUIDE = [
    { size: '20 cm', serves: '1 – 2 people', use: 'Fried eggs, crêpes and single portions' },
    { size: '24 cm', serves: '2 – 4 people', use: 'Everyday frying, vegetables and sides' },
    { size: '28 cm', serves: '4 – 6 people', use: 'Steaks, fish and family meals' }
  ];

  var CARE_BY_SURFACE = {
    'Non-stick':
      '<p>Rinse and dry before first use, then wipe the surface with a little cooking oil. Use low to medium heat — the multilayer base makes high settings unnecessary for everyday frying.</p>' +
      '<ul class="care-ul"><li>Hand-washing with warm water and a soft sponge keeps the non-stick coating at its best (dishwasher-safe for convenience).</li>' +
      '<li>Metal utensils are fine thanks to the Protection Grid, but avoid cutting directly in the pan.</li>' +
      '<li>Let the pan cool before rinsing to protect the base from warping.</li></ul>',
    'Ceramic':
      '<p>Rinse and dry before first use. Ceramic surfaces like moderate heat and a little fat for the best release.</p>' +
      '<ul class="care-ul"><li>Hand-washing with a soft sponge preserves the ceramic surface.</li>' +
      '<li>Avoid thermal shock — let the pan cool before rinsing.</li></ul>',
    'Uncoated':
      '<p>Pre-heat the empty pan over medium heat, add oil and let it shimmer before adding food. A natural patina builds over time and improves release.</p>' +
      '<ul class="care-ul"><li>Dishwasher-safe; stubborn residues lift easily after a short soak.</li>' +
      '<li>Polish occasionally with a stainless-steel cleaner to keep the shine.</li></ul>'
  };

  function renderPDP(api) {
    var DATA = api.data, esc = api.esc, eur = api.eur, img = api.img, isSale = api.isSale;
    var t = api.t || function (x) { return x; };
    var lang = api.lang || 'en';
    var nameOf = api.nameOf || function (p) { return p.name; };
    var descOf = api.descOf || function (p) { return p.description; };
    /* keyed lookup with an explicit fallback (t() falls back to the key itself) */
    function tt(key, fb) { var v = t(key); return v === key ? fb : v; }
    var products = DATA.products;

    var id = new URLSearchParams(location.search).get('id') || 'p1';
    var p = products.find(function (x) { return x.id === id; }) || products.find(function (x) { return x.id === 'p1'; }) || products[0];
    if (!p) return;
    var sel = p.default || 0;
    var colorSel = p.colors ? (p.defaultColor || 0) : -1;   // colour-variant products
    var isHero = p.series === HERO_SERIES;
    /* the sku that drives the packshot / price / article number */
    function curSku() { return p.colors ? p.colors[colorSel].sku : p.variants[sel].sku; }

    document.title = 'WMF · ' + nameOf(p);

    /* ---------- breadcrumb (catalog category trails) ---------- */
    var catKey = p.cats && ('frying-pans' in p.cats) ? 'frying-pans'
               : p.cats && ('pots' in p.cats) ? 'pots'
               : 'pans';
    var CAT_PAGE = { 'frying-pans': 'frying-pans.html', 'pots': 'pots.html', 'pans': 'pans.html' };
    var CAT_HREF = { 'Home': 'index.html', 'Products': 'pans.html', 'Pans': 'pans.html', 'Frying Pans': 'frying-pans.html', 'Pots': 'pots.html' };
    var trail = (DATA.categories && DATA.categories[catKey] && DATA.categories[catKey].breadcrumb) || ['Home', 'Products', 'Pans'];
    var crumbs = document.getElementById('pdpCrumbs');
    if (crumbs) {
      crumbs.innerHTML = trail.map(function (c) {
        var href = CAT_HREF[c];
        return '<li>' + (href ? '<a href="' + href + '">' + esc(t(c)) + '</a>' : esc(t(c))) + '</li>';
      }).join('') + '<li>' + esc(nameOf(p)) + '</li>';
    }

    /* ---------- gallery ---------- */
    var items = [];
    if (isHero) {
      items = HERO_GALLERY.slice();
      items.splice(1, 0, { kind: 'packshot' });   // real product photo as 2nd thumb
    } else if (p.colors) {
      items = [{ kind: 'packshot' }];              // just the colour packshot; the swatch swaps it
    } else {
      items = [{ kind: 'packshot' }, { src: 'assets/inuse.jpg', kind: 'life', alt: 'The pan in use' }];
    }
    var active = 0;

    var stage = document.getElementById('pdpStage');
    var mainImg = document.getElementById('pdpMain');
    var flag = document.getElementById('pdpVideoFlag');
    var thumbsEl = document.getElementById('pdpThumbs');
    var prevBtn = document.getElementById('pdpPrev');
    var nextBtn = document.getElementById('pdpNext');
    var progress = document.getElementById('pdpProgress');

    function itemSrc(it) { return it.kind === 'packshot' ? img(curSku()) : it.src; }
    function renderStage() {
      var it = items[active];
      mainImg.src = itemSrc(it);
      mainImg.alt = it.kind === 'packshot' ? p.brand + ' ' + nameOf(p) : (it.alt || '');
      stage.classList.toggle('is-packshot', it.kind === 'packshot');
      flag.hidden = !it.video;
      var many = items.length > 1;
      prevBtn.hidden = nextBtn.hidden = !many;
      progress.hidden = !many;
      prevBtn.disabled = active === 0;
      nextBtn.disabled = active === items.length - 1;
      var seg = progress.querySelector('span');
      seg.style.width = (100 / items.length) + '%';
      seg.style.transform = 'translateX(' + (active * 100) + '%)';
    }
    function stepGallery(d) {
      active = Math.max(0, Math.min(items.length - 1, active + d));
      renderStage(); renderThumbs(); renderLightbox();
    }
    prevBtn.addEventListener('click', function () { stepGallery(-1); });
    nextBtn.addEventListener('click', function () { stepGallery(1); });

    /* ---------- fullscreen lightbox (the live shop's gallery zoom) ---------- */
    var lightbox = document.getElementById('pdpLightbox');
    var zoomBtn = document.getElementById('pdpZoom');
    var LB_X = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
    var LB_L = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"/></svg>';
    var LB_R = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>';

    function lightboxOpen() { return lightbox && lightbox.getAttribute('aria-hidden') === 'false'; }
    function renderLightbox() {
      if (!lightboxOpen()) return;
      var it = items[active];
      var im = lightbox.querySelector('img');
      im.src = itemSrc(it);
      im.alt = it.kind === 'packshot' ? p.brand + ' ' + p.name : (it.alt || '');
      lightbox.querySelector('.lb-prev').disabled = active === 0;
      lightbox.querySelector('.lb-next').disabled = active === items.length - 1;
      lightbox.querySelector('.lb-count').textContent = (active + 1) + ' / ' + items.length;
    }
    function openLightbox() {
      lightbox.innerHTML =
        '<button class="lb-close" aria-label="Close">' + LB_X + '</button>' +
        '<button class="pdp-nav lb-prev" aria-label="Previous image">' + LB_L + '</button>' +
        '<img alt="">' +
        '<button class="pdp-nav lb-next" aria-label="Next image">' + LB_R + '</button>' +
        '<span class="lb-count"></span>';
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      renderLightbox();
      var c = lightbox.querySelector('.lb-close');
      if (c) c.focus();
    }
    function closeLightbox() {
      if (!lightboxOpen()) return;
      lightbox.setAttribute('aria-hidden', 'true');
      lightbox.innerHTML = '';
      document.body.style.overflow = '';
    }
    zoomBtn.addEventListener('click', openLightbox);
    mainImg.addEventListener('click', openLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target.closest('.lb-close')) { closeLightbox(); return; }
      if (e.target.closest('.lb-prev')) { stepGallery(-1); return; }
      if (e.target.closest('.lb-next')) { stepGallery(1); return; }
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
      else if (lightboxOpen() && e.key === 'ArrowLeft') stepGallery(-1);
      else if (lightboxOpen() && e.key === 'ArrowRight') stepGallery(1);
    });
    function renderThumbs() {
      thumbsEl.style.display = items.length > 1 ? '' : 'none';   // no thumb strip for a single image
      thumbsEl.innerHTML = items.map(function (it, i) {
        return '<button class="pdp-thumb' + (i === active ? ' sel' : '') + (it.kind === 'packshot' ? ' is-packshot' : '') + '" data-i="' + i + '" aria-label="Image ' + (i + 1) + '">' +
          '<img src="' + esc(itemSrc(it)) + '" alt="">' + '</button>';
      }).join('');
    }
    thumbsEl.addEventListener('click', function (e) {
      var b = e.target.closest('.pdp-thumb'); if (!b) return;
      active = +b.dataset.i; renderStage(); renderThumbs();
    });

    /* ---------- buy box ---------- */
    var box = document.getElementById('buyBox');
    var descOpen = false;
    var accIdx = 0;

    var ICONS = {
      /* WMF delivery / store / info glyphs from the Figma buy box (fill = currentColor) */
      info: '<svg width="13" height="13" viewBox="0 0 10 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5 0.78125C7.31682 0.78125 9.21875 2.65771 9.21875 5C9.21875 7.3299 7.33184 9.21875 5 9.21875C2.67102 9.21875 0.78125 7.33277 0.78125 5C0.78125 2.67182 2.66801 0.78125 5 0.78125ZM5 0.15625C2.32506 0.15625 0.15625 2.32584 0.15625 5C0.15625 7.67572 2.32506 9.84375 5 9.84375C7.67494 9.84375 9.84375 7.67572 9.84375 5C9.84375 2.32584 7.67494 0.15625 5 0.15625ZM4.77559 2.5H5.22439C5.35766 2.5 5.46412 2.61098 5.45857 2.74414L5.32186 6.02539C5.31662 6.15094 5.21334 6.25 5.08768 6.25H4.9123C4.78666 6.25 4.68336 6.15092 4.67812 6.02539L4.54141 2.74414C4.53588 2.61098 4.64232 2.5 4.77559 2.5ZM5 6.64062C4.69797 6.64062 4.45312 6.88547 4.45312 7.1875C4.45312 7.48953 4.69797 7.73438 5 7.73438C5.30203 7.73438 5.54688 7.48953 5.54688 7.1875C5.54688 6.88547 5.30203 6.64062 5 6.64062Z"/></svg>',
      truck: '<svg width="20" height="15" viewBox="0 0 13 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12.8375 7.5H12.35V5.38867C12.35 5.06055 12.2119 4.73828 11.9681 4.50586L10.2639 2.86719C10.0242 2.63281 9.68906 2.5 9.34578 2.5H8.45V1.53516C8.45 1.0332 7.99906 0.625 7.44656 0.625H1.00344C0.450938 0.625 0 1.0332 0 1.53516V7.21484C0 7.7168 0.450938 8.125 1.00344 8.125H1.3325C1.31016 8.22656 1.3 8.33008 1.3 8.4375C1.3 9.30078 2.02719 10 2.925 10C3.82281 10 4.55 9.30078 4.55 8.4375C4.55 8.33008 4.53781 8.22656 4.5175 8.125H8.4825C8.46016 8.22656 8.45 8.33008 8.45 8.4375C8.45 9.30078 9.17719 10 10.075 10C10.9728 10 11.7 9.30078 11.7 8.4375C11.7 8.33008 11.6878 8.22656 11.6675 8.125H12.8375C12.9269 8.125 13 8.05469 13 7.96875V7.65625C13 7.57031 12.9269 7.5 12.8375 7.5ZM9.34578 3.125C9.51641 3.125 9.685 3.19141 9.80484 3.30859L11.5091 4.94727C11.5253 4.96289 11.5314 4.98438 11.5456 5.00195H8.45V3.12695H9.34578V3.125ZM2.925 9.375C2.38672 9.375 1.95 8.95508 1.95 8.4375C1.95 7.91992 2.38672 7.5 2.925 7.5C3.46328 7.5 3.9 7.91992 3.9 8.4375C3.9 8.95508 3.46328 9.375 2.925 9.375ZM4.21688 7.5C3.92031 7.12305 3.45312 6.875 2.925 6.875C2.39687 6.875 1.92969 7.12305 1.63312 7.5H1.00344C0.808437 7.5 0.65 7.37305 0.65 7.21484V1.53516C0.65 1.37695 0.808437 1.25 1.00344 1.25H7.44656C7.64156 1.25 7.8 1.37695 7.8 1.53516V7.5H4.21688ZM10.075 9.375C9.53672 9.375 9.1 8.95508 9.1 8.4375C9.1 7.91992 9.53672 7.5 10.075 7.5C10.6133 7.5 11.05 7.91992 11.05 8.4375C11.05 8.95508 10.6133 9.375 10.075 9.375ZM10.075 6.875C9.54484 6.875 9.07969 7.12305 8.78312 7.5H8.45V5.625H11.7V7.5H11.3669C11.0703 7.12305 10.6052 6.875 10.075 6.875Z"/></svg>',
      store: '<svg width="18" height="15" viewBox="0 0 12 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.9197 3.43945L10.2059 0.314453C10.0991 0.121094 9.9003 0 9.68468 0H2.31593C2.1003 0 1.90155 0.121094 1.79468 0.314453L0.0809292 3.43945C-0.147821 3.85742 0.139054 4.375 0.600304 4.375H1.2003V9.3457C1.2003 9.70703 1.46843 10 1.8003 10H6.6003C6.93218 10 7.2003 9.70703 7.2003 9.3457V4.375H10.2003V9.84375C10.2003 9.92969 10.2678 10 10.3503 10H10.6503C10.7328 10 10.8003 9.92969 10.8003 9.84375V4.375H11.4003C11.8616 4.375 12.1484 3.85742 11.9197 3.43945ZM6.6003 9.3457C6.6003 9.36328 6.59468 9.37305 6.59655 9.375L1.81155 9.37891C1.81155 9.37891 1.8003 9.36914 1.8003 9.3457V6.875H6.6003V9.3457ZM6.6003 6.25H1.8003V4.375H6.6003V6.25ZM0.602179 3.75L2.31593 0.625H9.68468L11.4003 3.75H0.602179Z"/></svg>',
      ret: '<svg width="20" height="15" viewBox="0 0 24 18" fill="none" stroke="#1a1a1a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h11a5 5 0 0 1 0 10H8"/><path d="m8 3-4 4 4 4"/></svg>',
      crown: '<svg width="18" height="15" viewBox="0 0 24 20" fill="none" stroke="#1a1a1a" stroke-width="1.5" stroke-linejoin="round"><path d="M3 6l4 4 5-6 5 6 4-4-1.5 11h-15L3 6Z"/></svg>',
      heart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21.5l8.8-8.8a5 5 0 0 0 0-7.1Z"/></svg>'
    };

    /* configurations of the same product family (single / with accessory / sets),
       tagged by bundleGroup in the catalog; ordered single → accessory → sets */
    function bundleRank(o) {
      var m = /Set of (\d+)/i.exec(o.bundleLabel || '');
      if (m) return 10 + (+m[1]);
      return /^with/i.test(o.bundleLabel || '') ? 5 : 0;
    }
    var bundleOpts = p.bundleGroup
      ? products.filter(function (x) { return x.bundleGroup === p.bundleGroup; })
                .sort(function (a, b) { return bundleRank(a) - bundleRank(b); })
      : [];

    function titleFor(v) {
      return /^\d+\s*cm$/i.test(v.size) ? nameOf(p) + ', ' + v.size : nameOf(p);
    }
    function shortDesc(full) {
      if (!full) return '';
      if (full.length <= 150) return full;
      var cut = full.slice(0, 150);
      return cut.slice(0, cut.lastIndexOf(' ')) + '…';
    }

    function buyBoxHTML() {
      var v = p.variants[sel];
      if (p.colors) {   // the selected colour drives price / sku / stock
        var col = p.colors[colorSel];
        v = { sku: col.sku, size: v.size, price: col.price, msrp: col.msrp || null, stock: col.stock !== false, label: null };
      }
      var onSale = isSale(v);
      var save = onSale ? Math.round((1 - v.price / v.msrp) * 100) : 0;
      var klarna = (v.price / 3).toFixed(2);
      if (lang === 'de') klarna = klarna.replace('.', ',');
      var points = Math.round(v.price);
      var h = '';

      // series eyebrow links to its category PLP, pre-filtered to that series
      if (p.series) {
        var catPage = CAT_PAGE[catKey] || 'pans.html';
        h += '<a class="bb-eyebrow" href="' + catPage + '?series=' + encodeURIComponent(p.series) + '">' + esc(p.series) + '</a>';
      } else {
        h += '<span class="bb-eyebrow">' + esc(p.brand) + '</span>';
      }
      h += '<h1 class="bb-title">' + esc(titleFor(v)) + '</h1>';

      if (isHero) {
        // honeycomb hero: benefit-bulleted description (teaser collapsed, full expanded)
        h += '<div class="bb-desc">' +
          (descOpen ? tt('desc:hero', DESC_HERO.full) : '<p>' + esc(t(DESC_HERO.teaser)) + '</p>') + '</div>';
        h += '<button class="bb-readmore" data-act="readmore" aria-expanded="' + descOpen + '">' + (descOpen ? t('Read less') : t('Read more')) + '</button>';
      } else {
        var desc = descOf(p);
        if (desc) {
          h += '<p class="bb-desc">' + esc(descOpen ? desc : shortDesc(desc)) + '</p>';
          if (desc.length > 150) {
            h += '<button class="bb-readmore" data-act="readmore" aria-expanded="' + descOpen + '">' + (descOpen ? t('Read less') : t('Read more')) + '</button>';
          }
        }
      }

      if (p.rating != null) {
        h += '<a class="bb-rating" href="#reviews">' +
          '<span class="stars" style="--pct:' + Math.round(p.rating / 5 * 100) + '%"></span>' +
          '<span class="rating-count">(' + p.rating.toFixed(1) + ') ' + p.reviews + ' ' + (p.reviews === 1 ? t('Review') : t('Reviews')) + '</span></a>';
      }

      /* Price Display component (Figma 1621:6329) — Default / Discount variants */
      h += '<div class="bb-price-row">' +
        '<span class="bb-price' + (onSale ? ' sale' : '') + '">' + eur(v.price) + '</span>' +
        (onSale ? '<span class="discount">' + t('Save %n%').replace('%n', save) + '</span>' : '') +
        '</div>';
      if (onSale) h += '<p class="bb-was">' + eur(v.msrp) + ' ' + t('(last 30 days lowest price)') + '</p>';
      h += '<p class="bb-vat">' + t('Including VAT') + ' <span class="bb-shiphint">' +
        (onSale ? t('shipping (free shipping on orders over €49)') : t('(free shipping on orders over €49)')) +
        '</span></p>';

      h += '<div class="bb-bar bb-bar--klarna"><img src="assets/pdp/klarna.png" alt="Klarna">' +
        '<span>' + t('3 payments of %x € at 0% interest with Klarna').replace('%x', klarna) + ' <a href="#">' + t('Learn more') + '</a></span>' +
        '<button class="bar-info" aria-label="More about Klarna">' + ICONS.info + '</button></div>';

      /* Set / bundle configurations — the same selector pattern as colour and
         size, just with roomier cards (image + label + price per option). */
      if (bundleOpts.length > 1) {
        h += '<div class="bb-bundles"><div class="bb-bundles-head">' +
          '<span class="bb-bundles-lbl">' + t('Set offer') + '</span>' +
          '<span class="bb-bundle-sel">' + esc(t(p.bundleLabel || '')) + '</span></div>' +
          '<div class="bb-bundle-opts">' + bundleOpts.map(function (o) {
            var ov = o.variants[o.default] || o.variants[0];
            var oSave = isSale(ov) ? Math.round(ov.msrp - ov.price) : 0;
            var isCur = o.id === p.id;
            var inner = '<span class="bb-bundle-img"><img src="' + img(ov.sku) + '" alt=""></span>' +
              '<span class="bb-bundle-t">' + esc(t(o.bundleLabel || '')) + '</span>' +
              '<span class="bb-bundle-p">' + eur(ov.price) +
              (oSave ? '<span class="discount">' + t('Save €%n').replace('%n', oSave) + '</span>' : '') + '</span>';
            return isCur
              ? '<span class="bb-bundle-opt sel" aria-current="true">' + inner + '</span>'
              : '<a class="bb-bundle-opt" href="product.html?id=' + o.id + '">' + inner + '</a>';
          }).join('') + '</div></div>';
      }

      // colour swatches (image tiles, selected outlined) — the live-shop / reference pattern
      if (p.colors) {
        h += '<div class="bb-colors"><div class="bb-colors-head">' +
          '<span class="bb-colors-lbl">' + t('Color') + '</span>' +
          '<span class="bb-color-name">' + esc(p.colors[colorSel].name) + '</span></div>' +
          '<div class="bb-swatches">' + p.colors.map(function (c, i) {
            return '<button class="bb-swatch' + (i === colorSel ? ' sel' : '') + (c.stock === false ? ' oos' : '') +
              '" data-color="' + i + '" title="' + esc(c.name + (c.stock === false ? ' · ' + t('Out of stock') : '')) + '" aria-label="' + esc(c.name) + '">' +
              '<img src="' + img(c.sku) + '" alt=""></button>';
          }).join('') + '</div></div>';
      }

      // size chips — only when there's a choice to make (more than one size)
      if (p.variants.length > 1) {
        h += '<div class="bb-sizes"><div class="bb-sizes-head"><span class="lbl">' + t('Size:') + '</span><a href="#" data-act="size-guide">' + t('Size Guide') + '</a></div>' +
          '<div class="bb-size-chips">' + p.variants.map(function (vv, i) {
            var hint = SIZE_HINTS[vv.size];
            return '<button class="bb-size' + (i === sel ? ' sel' : '') + (vv.stock ? '' : ' oos') + '" data-i="' + i + '"' +
              ' title="' + esc((hint ? t(hint) + (vv.stock ? '' : ' · ' + t('Out of stock')) : (vv.stock ? '' : t('Out of stock')))) + '">' +
              esc(t(vv.size)) + '</button>';
          }).join('') + '</div></div>';
      }

      h += '<div class="bb-acc-head"><span class="lbl">' + t('Also add:') + '</span>' +
        '<span class="bb-acc-nav">' +
        '<button class="bb-acc-arrow" data-act="acc-prev" aria-label="Previous accessory"' + (accIdx === 0 ? ' disabled' : '') + '>' +
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"/></svg></button>' +
        '<button class="bb-acc-arrow" data-act="acc-next" aria-label="Next accessory"' + (accIdx === ACCESSORIES.length - 1 ? ' disabled' : '') + '>' +
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg></button>' +
        '</span></div>' +
        '<div class="bb-acc-viewport"><div class="bb-acc-track" style="transform:translateX(-' + (accIdx * 100) + '%)">' +
        ACCESSORIES.map(function (acc) {
          return '<div class="bb-acc"><img src="' + acc.img + '" alt="">' +
            '<span><span class="bb-acc-name">' + esc(t(acc.name)) + '</span><br><span class="bb-acc-price">' + eur(acc.price) + '</span></span>' +
            '<button class="bb-acc-add" data-act="acc-add" aria-label="' + esc(t(acc.name)) + '">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1c1c1c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l1 12.5H5L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg></button></div>';
        }).join('') + '</div></div>';

      h += '<div class="bb-delivery">' +
        '<div class="bb-del-row"><span class="bb-del-head">' + ICONS.truck + ' ' + t('Online Delivery') + '</span>' +
        (v.stock
          ? '<span class="bb-del-line"><span class="dot"></span>' + t('Available Immediately - delivered in 1-3 days') + '</span>'
          : '<span class="bb-del-line warn"><span class="dot"></span>' + t('Out of stock online - back soon') + '</span>') +
        '</div>' +
        '<div class="bb-del-row"><span class="bb-del-head">' + ICONS.store + ' Click &amp; Collect</span>' +
        '<span class="bb-del-line"><span class="dot"></span>' + t('Available in Würzburg') + ' <a href="#">' + t('Change Store') + '</a></span></div></div>';

      h += '<div class="bb-cta-row">' +
        '<button class="bb-cta" data-act="add"' + (v.stock ? '' : ' disabled') + '>' + (v.stock ? t('Add to cart') : t('Out of stock')) + '</button>' +
        '<button class="bb-wish" data-act="wish" aria-label="Add to wishlist">' + ICONS.heart + '</button></div>';

      h += '<div class="bb-bar bb-bar--club"><img src="assets/pdp/mywmf.png" alt="myWMF">' +
        '<span>' + t('Earn <b>%n</b> Club Points with this purchase').replace('%n', points) + '</span>' +
        '<button class="bar-info" data-act="club-info" aria-label="About Club Points">' + ICONS.info + '</button></div>';


      /* bundle products list their components (live-shop "Dieses Set enthält") */
      if (p.bundle && p.bundle.length) {
        h += '<div class="bb-bundle"><span class="lbl">' + t('This set contains:') + '</span>' +
          p.bundle.map(function (b) {
            var inner = '<span class="bb-bundle-thumb"><img src="' + img(b.sku) + '" alt=""></span>' +
              '<span>' + (b.qty || 1) + ' × ' + esc(t(b.name)) + '</span>';
            return b.id
              ? '<a class="bb-bundle-row" href="product.html?id=' + b.id + '">' + inner + '</a>'
              : '<span class="bb-bundle-row">' + inner + '</span>';
          }).join('') + '</div>';
      }

      h += '<div class="bb-trust">' +
        '<div class="bb-trust-tile">' + ICONS.truck + '<span class="t1">' + t('Free Delivery') + '</span><span class="t2">' + t('Orders over €49') + '</span></div>' +
        '<div class="bb-trust-tile">' + ICONS.ret + '<span class="t1">' + t('Free Returns') + '</span><span class="t2">DHL Go-Green</span></div>' +
        '<div class="bb-trust-tile">' + ICONS.crown + '<span class="t1">' + t('175+ Years') + '</span><span class="t2">' + t('Fine Craftsmanship') + '</span></div></div>';

      return h;
    }

    function renderBuyBox() { box.innerHTML = buyBoxHTML(); }

    function bumpCart() {
      var el = document.querySelector('.cart-count');
      if (el) el.textContent = (parseInt(el.textContent, 10) || 0) + 1;
    }

    box.addEventListener('click', function (e) {
      var swatch = e.target.closest('.bb-swatch');
      if (swatch) {
        colorSel = +swatch.dataset.color;
        renderBuyBox(); renderStage(); renderThumbs(); renderTech();
        return;
      }
      var size = e.target.closest('.bb-size');
      if (size) {
        sel = +size.dataset.i;
        renderBuyBox(); renderStage(); renderThumbs(); renderTech();
        return;
      }
      var act = e.target.closest('[data-act]');
      if (!act) return;
      var a = act.getAttribute('data-act');
      if (a === 'readmore') { descOpen = !descOpen; renderBuyBox(); }
      else if (a === 'add') {
        bumpCart();
        act.classList.add('added'); act.textContent = t('Added ✓');
        setTimeout(function () { act.classList.remove('added'); act.textContent = t('Add to cart'); }, 1400);
      }
      else if (a === 'acc-add') { bumpCart(); }
      else if (a === 'wish') { act.classList.toggle('on'); }
      else if (a === 'acc-prev' || a === 'acc-next') {
        accIdx = Math.max(0, Math.min(ACCESSORIES.length - 1, accIdx + (a === 'acc-next' ? 1 : -1)));
        updateAccSlider();
      }
      else if (a === 'size-guide') { e.preventDefault(); openModal(sizeGuideHTML()); }
      else if (a === 'club-info') { openModal(clubHTML()); }
    });

    /* colour name previews the hovered swatch (+ any price difference vs the
       selected colour), reverting to the selected on leave */
    box.addEventListener('mouseover', function (e) {
      if (!p.colors) return;
      var sw = e.target.closest('.bb-swatch'); if (!sw) return;
      var nm = box.querySelector('.bb-color-name'); if (!nm) return;
      var hovered = p.colors[+sw.dataset.color];
      var diff = hovered.price - p.colors[colorSel].price;
      var html = esc(hovered.name);
      if (Math.abs(diff) >= 0.005) {
        html += '<span class="bb-color-diff">' + (diff > 0 ? '+' : '−') + eur(Math.abs(diff)) + '</span>';
      }
      nm.innerHTML = html;
    });
    box.addEventListener('mouseout', function (e) {
      if (!p.colors) return;
      if (!e.target.closest('.bb-swatch')) return;
      var to = e.relatedTarget;
      if (to && to.closest && to.closest('.bb-swatch')) return;   // moving between swatches
      var nm = box.querySelector('.bb-color-name');
      if (nm) nm.textContent = p.colors[colorSel].name;
    });

    /* slide in place so the CSS transition runs (a re-render would jump) */
    function updateAccSlider() {
      var t = box.querySelector('.bb-acc-track');
      if (t) t.style.transform = 'translateX(-' + (accIdx * 100) + '%)';
      var pv = box.querySelector('[data-act="acc-prev"]');
      var nx = box.querySelector('[data-act="acc-next"]');
      if (pv) pv.disabled = accIdx === 0;
      if (nx) nx.disabled = accIdx === ACCESSORIES.length - 1;
    }

    /* ---------- modals (size guide / club points) ---------- */
    var modal = document.getElementById('pdpModal');

    function openModal(html) {
      if (!modal) return;
      modal.innerHTML = '<div class="pdp-modal-scrim" data-modal-close></div>' +
        '<div class="pdp-modal-panel" role="dialog" aria-modal="true">' +
        '<button class="pdp-modal-close" data-modal-close aria-label="Close">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
        html + '</div>';
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      var c = modal.querySelector('.pdp-modal-close');
      if (c) c.focus();
    }
    function closeModal() {
      if (!modal || !modal.classList.contains('open')) return;
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML = '';
      document.body.style.overflow = '';
    }
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target.closest('[data-modal-close]')) closeModal();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
      });
    }

    function sizeGuideHTML() {
      var isSet = !p.sizes.some(function (s) { return /^\d+\s*cm$/i.test(s); });
      var rows = SIZE_GUIDE.map(function (r) {
        var has = p.sizes.indexOf(r.size) >= 0;
        return '<div class="sg-row' + (has ? '' : ' dim') + '"><b>' + r.size +
          (has ? '<span class="tick">✓</span>' : '') + '</b><span>' + t(r.serves) + '</span><span>' + t(r.use) + '</span></div>';
      }).join('');
      return '<h3>' + t('Size Guide') + '</h3>' +
        '<p class="pm-note">' + t('Frying pan sizes are measured across the top rim — the usable cooking surface is roughly 4\u00a0cm smaller. When in doubt, size up: food browns better with room around it.') + '</p>' +
        '<div class="sg-table"><div class="sg-row head"><span>' + t('Size') + '</span><span>' + t('Serves') + '</span><span>' + t('Typical use') + '</span></div>' + rows + '</div>' +
        '<p class="pm-note">' + esc(isSet
          ? t('The %name combines the most-used sizes in one set (%sizes).').replace('%name', nameOf(p)).replace('%sizes', p.sizes.map(function (x) { return t(x); }).join(', '))
          : t('The %name is available in %sizes — ticked above.').replace('%name', nameOf(p)).replace('%sizes', p.sizes.join(lang === 'de' ? ' und ' : ' and '))) + '</p>';
    }

    function clubHTML() {
      var pts = Math.round(p.variants[sel].price);
      return '<h3>' + t('myWMF Club Points') + '</h3>' +
        '<p class="pm-note">' + t('Collect Club Points with every order — 1 point for every €1 you spend.') + '</p>' +
        '<ul class="care-ul">' +
        '<li>' + t('Points are added to your myWMF account as soon as your order ships.') + '</li>' +
        '<li>' + t('Redeem them at checkout: 100 points = a €5 reward.') + '</li>' +
        '<li>' + t('Members also get early access to seasonal offers and a birthday treat.') + '</li>' +
        '</ul>' +
        '<p class="pm-highlight">' + t('You would earn <b>%n Club Points</b> with this purchase.').replace('%n', pts) + '</p>' +
        '<button class="gold-pill" data-modal-close>' + t('Join myWMF — it’s free') + '</button>';
    }

    /* ---------- marketing example content (Profi Resist family only) ---------- */
    if (isHero) {
      var mk = document.getElementById('pdpMarketing'); if (mk) mk.hidden = false;
      var rc = document.getElementById('pdpRecipes'); if (rc) rc.hidden = false;
    }

    /* ---------- reviews ----------
       Real reviews scraped from the German shop (see README): each carries its
       own star count, author and date, with the body in both languages. */
    var list = document.getElementById('reviewsList');
    if (list) {
      var items = p.reviewItems || [];
      if (items.length) {
        list.innerHTML = items.map(function (r) {
          var title = (lang === 'de' ? r.title_de : r.title) || '';
          var text = (lang === 'de' ? r.text_de : r.text) || '';
          return '<article class="review"><span class="stars" style="--pct:' + Math.round((r.stars || 0) / 5 * 100) + '%"></span>' +
            '<div class="review-meta"><span class="review-name">' + esc(r.name) + '</span><span class="review-date">' + esc(r.date) + '</span></div>' +
            '<h4>' + esc(title) + '</h4><p>' + esc(text) + '</p></article>';
        }).join('') +
        (p.reviews > items.length ? '<div class="reviews-more"><button class="btn-outline">' + t('Show more +') + '</button></div>' : '');
      } else {
        list.innerHTML = '<p class="reviews-none">' + t('No reviews yet — be the first to review this product.') + '</p>';
      }
    }

    /* ---------- use & care + technical data ---------- */
    var careEl = document.getElementById('careUse');
    if (careEl) {
      var careKey = CARE_BY_SURFACE[p.surface] ? p.surface : 'Non-stick';
      careEl.innerHTML = tt('care:' + careKey, CARE_BY_SURFACE[careKey]);
    }

    function renderTech() {
      var tech = document.getElementById('techTable'); if (!tech) return;
      var rows = [
        ['Series', p.series],
        ['Type', t(p.type)],
        ['Color', p.colors ? p.colors[colorSel].name : null],
        ['Material', t(p.material)],
        ['Surface', t(p.surface)],
        ['Cooking technique', t(p.technique)],
        ['Sizes', p.sizes.map(function (s) { return t(s) + (SIZE_HINTS[s] ? ' (' + t(SIZE_HINTS[s]) + ')' : ''); }).join(', ')],
        ['Article number', curSku()],
        ['Hob compatibility', t('All hobs, including induction')],
        ['Oven-safe', t('Up to 250°C')]
      ].filter(function (r) { return r[1]; });
      tech.innerHTML = rows.map(function (r) { return '<dt>' + esc(t(r[0])) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('');
    }

    /* ---------- suitable alternatives (same category, real order) ---------- */
    var alts = products
      .filter(function (x) { return x.id !== p.id && x.cats && (catKey in x.cats); })
      .sort(function (a, b) { return (a.cats[catKey] || 999) - (b.cats[catKey] || 999); })
      .slice(0, 4);
    var altTrack = document.getElementById('xsAlternatives');
    if (altTrack) {
      if (alts.length) {
        altTrack.innerHTML = alts.map(api.cardHTML).join('');
        altTrack.addEventListener('click', function (e) {
          var sw = e.target.closest('.swatch'); if (!sw) return;
          var card = sw.closest('.card');
          var prod = products.find(function (x) { return x.id === card.getAttribute('data-id'); });
          if (!prod) return;
          prod._sel = parseInt(sw.dataset.i, 10);
          card.outerHTML = api.cardHTML(prod);
        });
      } else {
        var blk = document.getElementById('xsAlternativesBlock'); if (blk) blk.hidden = true;
      }
    }

    /* ---------- UGC arrows ---------- */
    document.querySelectorAll('.track-arrow').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = document.getElementById(b.dataset.track); if (!t) return;
        t.scrollBy({ left: (+b.dataset.dir) * 508, behavior: 'smooth' });
      });
    });

    /* ---------- boot ---------- */
    renderStage(); renderThumbs(); renderBuyBox(); renderTech();
  }

  window.renderPDP = renderPDP;
})();
