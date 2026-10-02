/* ============================================================
   WMF shop prototype — PDP runtime (product.html)
   Figma "WMF Mockups PANS" · PDP v2 (desktop 2399:276, mobile 2666:1164)
   and the bundle PDP (3234:2347). app.js loads the catalog and calls
   window.renderPDP(api) once it arrives; everything product-specific
   renders from the catalog. Bundle products (the shop's
   `bundle-<sku>-<sku>` articles) get the bundle template: set price with
   the saving vs. buying the items individually, a collapsible
   "This bundle includes" box with each item's own rating, and the set's
   advantages in place of the accessory upsell.
   ============================================================ */
(function () {
  'use strict';

  /* Figma lifestyle gallery + feature tiles for the Profi Resist family
     (the design's example product). Other products show their packshot. */
  var HERO_SERIES = 'Profi Resist';
  var HERO_GALLERY = [
    { src: 'assets/pdp/gallery-steak.jpg',     kind: 'life', video: true, alt: 'Steak searing in the pan on a gas hob' },
    { src: 'assets/pdp/gallery-honeycomb.jpg', kind: 'life', alt: 'Honeycomb structure close-up' },
    { src: 'assets/pdp/gallery-3ply.jpg',      kind: 'life', alt: '3-ply construction' },
    { src: 'assets/pdp/gallery-clean.jpg',     kind: 'life', alt: 'Easy to clean' },
    { src: 'assets/pdp/gallery-heat.jpg',      kind: 'life', alt: 'Fast, even heating' }
  ];
  /* Product Details tiles (PDP v2 "Features") — rich text, rendered not escaped */
  var HERO_FEATURES = [
    { img: 'assets/pdp/adv-control.jpg', title: 'Total Control, Every Time', key: 'adv.control',
      text: 'Fast, even heat edge-to-edge means predictable cooking with no hot spots, no constant turning, no second-guessing. Just consistent results, every meal.' },
    { img: 'assets/pdp/adv-searing.jpg', title: 'Restaurant-Level Searing at Home', key: 'adv.searing',
      text: 'It holds heat the moment food hits the pan, so you get that <b>deep golden crust</b> on steaks, chicken, and veg—without needing a commercial-grade setup.' },
    { img: 'assets/pdp/adv-healthy.jpg', title: 'Healthier Cooking, Effortless Release', key: 'adv.healthy',
      text: 'Cook with less oil and still get clean release. <b>Eggs glide</b>, fish stays intact, and delicate foods lift effortlessly—no tearing, no sticking.' },
    { img: 'assets/pdp/adv-robust.jpg', title: 'Robust Build, Lasting Performance', key: 'adv.robust',
      text: 'The raised honeycomb takes daily abrasion, helping protect the coating so performance lasts. Built for real world use, <b>metal utensil safe</b> and backed by a <b>10 year warranty</b>.' },
    { img: 'assets/pdp/adv-versatility.jpg', title: 'Seamless Versatility & Safety', key: 'adv.versatile',
      text: 'Induction-ready and compatible with gas and electric, plus <b>oven safe</b> when recipes go from stovetop to finish. The <b>cool-touch</b> handle keeps control comfortable and safe.' },
    { img: 'assets/pdp/adv-cleanup.jpg', title: 'Quick Cleanup, No Scrubbing', key: 'adv.cleanup',
      text: 'Because food releases cleanly, cleanup stays simple. A quick rinse or wipe and you’re done—less soaking, less scrubbing, more time back. <b>Dishwasher safe.</b>' }
  ];
  var HERO_DESC = {
    title: 'Profi Resist by WMF: The best of both worlds',
    text: 'Whether searing at high temperatures or preparing delicate dishes with little to no fat, the WMF Profi Resist frying pan combines the best of both worlds. This is thanks to its unique multi-layered construction with an aluminum core, a stainless steel interior, and an extremely durable chrome steel exterior, as well as the outstanding PermaDur non-stick coating, which is further protected by a special, raised honeycomb structure made of durable Cromargan®. This makes the Profi Resist frying pan not only scratch-resistant and exceptionally heat-resistant, but also prevents food from sticking. Because the fat is optimally distributed under the food, even and precise cooking results are the norm, not the exception. The coated pouring rim makes the pan even more durable and allows food to slide perfectly onto the plate. The Profi Resist frying pan is suitable for use on any hob and of course also in the oven, and offers further invaluable advantages in daily handling with its wide pouring rim for drip-free pouring of liquids and its heat-reducing handle.'
  };

  /* serving guidance under each size chip (Figma PDP v2 size chips) */
  var SIZE_HINTS = { '20 cm': 'For 1–2 people', '24 cm': 'For 2–3 people', '28 cm': 'For 3–4 people' };

  /* "Also add to your cart" — example accessories from the Figma mock */
  var ACCESSORIES = [
    { img: 'assets/pdp/acc-spatula.jpg', name: 'Profi Plus spatula, 32 cm', price: 22.99 },
    { img: 'assets/pdp/acc-guard.jpg', name: 'Splash guard for pans, 20, 24 and 28 cm', price: 29.99 },
    { img: 'assets/pdp/acc-mat.jpg', name: 'Pan protection mat set, 2-piece, 38 cm', price: 6.99 },
    { img: 'assets/pdp/acc-tongs.jpg', name: 'BBQ serving tongs', price: 24.99 }
  ];

  /* the Size Guide table (rim diameter; serving hints match the size chips) */
  var SIZE_GUIDE = [
    { size: '20 cm', serves: 'For 1–2 people', use: 'Fried eggs, crêpes and single portions' },
    { size: '24 cm', serves: 'For 2–3 people', use: 'Everyday frying, vegetables and sides' },
    { size: '28 cm', serves: 'For 3–4 people', use: 'Steaks, fish and family meals' }
  ];

  var V2 = 'assets/pdp/v2/';
  var ICONS = {
    info: '<img src="' + V2 + 'info.svg" width="13" height="13" alt="">',
    circledI: '<img src="' + V2 + 'circled-i.svg" width="16" height="16" alt="">',
    truck: '<img src="' + V2 + 'delivery.svg" width="20" height="15" alt="">',
    pin: '<img src="' + V2 + 'location.svg" width="13" height="18" alt="">',
    dot: '<img src="' + V2 + 'stock-dot.svg" width="8" height="8" alt="">',
    wish: '<img src="' + V2 + 'wish-btn.svg" width="56" height="56" alt="">',
    cart: '<img src="' + V2 + 'cart-btn.svg" width="56" height="56" alt="">',
    chevDown: '<img src="' + V2 + 'arrow-down.svg" width="16" height="16" alt="">'
  };
  var BENEFITS = [
    { icon: 'benefit-shipping.png', label: 'Free shipping on orders over €49' },
    { icon: 'benefit-free-return.png', label: 'Free returns' },
    { icon: 'benefit-30-return.png', label: '30-day return policy' },
    { icon: 'benefit-pickup.png', label: 'Free in-store pickup' }
  ];

  function renderPDP(api) {
    var DATA = api.data, esc = api.esc, eur = api.eur, img = api.img, isSale = api.isSale;
    var t = api.t || function (x) { return x; };
    var lang = api.lang || 'en';
    var nameOf = api.nameOf || function (p) { return p.name; };
    var descOf = api.descOf || function (p) { return p.description; };
    /* keyed lookup with an explicit fallback (t() falls back to the key itself) */
    function tt(key, fb) { var v = t(key); return v === key ? fb : v; }
    /* bilingual catalog field: x / x_de */
    function loc(o, k) { return (lang === 'de' && o[k + '_de'] != null) ? o[k + '_de'] : o[k]; }
    var products = DATA.products;
    function byId(id) { return products.find(function (x) { return x.id === id; }); }

    var id = new URLSearchParams(location.search).get('id') || 'p1';
    var p = byId(id) || byId('p1') || products[0];
    if (!p) return;
    var sel = p.default || 0;
    var colorSel = p.colors ? (p.defaultColor || 0) : -1;   // colour-variant products
    var isHero = p.series === HERO_SERIES;
    /* the shop's bundle articles carry a composite sku: bundle-<sku>-<sku>… */
    var isBundle = /^bundle-/.test(p.variants[0].sku);
    var info = p.bundleInfo || {};
    /* the sku that drives the packshot / price / article number */
    function curSku() { return p.colors ? p.colors[colorSel].sku : p.variants[sel].sku; }

    document.title = 'WMF · ' + nameOf(p);

    /* ---------- bundle components: price + rating from the catalog where the
       item exists there, else from the bundle entry itself ---------- */
    function component(b) {
      var prod = b.id ? byId(b.id) : null;
      var vv = prod && (prod.variants.find(function (x) { return x.sku === b.sku; }) || null);
      if (!vv && !prod) {
        products.some(function (x) {
          var m = x.variants.find(function (y) { return y.sku === b.sku; });
          if (m) { prod = x; vv = m; return true; }
          return false;
        });
      }
      return {
        qty: b.qty || 1,
        name: (lang === 'de' && b.name_de) || t(b.name),
        img: b.img || img(b.sku),
        href: prod ? 'product.html?id=' + prod.id : null,
        price: b.price != null ? b.price : (vv ? vv.price : null),
        rating: b.rating != null ? b.rating : (prod ? prod.rating : null),
        reviews: b.reviews != null ? b.reviews : (prod ? prod.reviews : 0),
        tech: b.tech || null, sku: b.sku
      };
    }
    var items = (p.bundle || []).map(component);
    /* "Bought individually" = the live shop's "statt" price (msrp) on bundles,
       else the sum of the item prices when every one is known */
    function setValue(prod, v) {
      if (/^bundle-/.test(v.sku) && v.msrp) return v.msrp;
      var its = (prod.bundle || []).map(component);
      if (its.length && its.every(function (c) { return c.price != null; })) {
        return its.reduce(function (s, c) { return s + c.price * c.qty; }, 0);
      }
      return v.msrp || null;
    }
    function savingOf(prod, v) {
      var total = setValue(prod, v);
      return (total && total - v.price > 0.005) ? total - v.price : 0;
    }

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
    var gallery = [];
    if (isBundle) {
      /* the set shot, then each item's packshot, then the set's detail shots */
      gallery = [{ kind: 'packshot' }].concat(items.map(function (c) {
        return { src: c.img, kind: 'item', alt: c.name };
      })).concat((info.gallery || []).map(function (s) { return { src: s, kind: 'item', alt: '' }; }));
    } else if (isHero) {
      gallery = HERO_GALLERY.slice();
      gallery.splice(1, 0, { kind: 'packshot' });   // real product photo as 2nd thumb
    } else if (p.colors) {
      gallery = [{ kind: 'packshot' }];              // just the colour packshot; the swatch swaps it
    } else {
      gallery = [{ kind: 'packshot' }, { src: 'assets/inuse.jpg', kind: 'life', alt: 'The pan in use' }];
    }
    var active = 0;

    var stage = document.getElementById('pdpStage');
    var track = document.getElementById('pdpTrack');
    var flag = document.getElementById('pdpVideoFlag');
    var thumbsEl = document.getElementById('pdpThumbs');
    var prevBtn = document.getElementById('pdpPrev');
    var nextBtn = document.getElementById('pdpNext');
    var progress = document.getElementById('pdpProgress');

    /* DS PromoLabel on the stage — bundles that save money: "Bundle savings" */
    var badge = document.getElementById('pdpBadge');
    if (badge && isBundle && savingOf(p, p.variants[0]) > 0) {
      badge.textContent = t('Bundle savings');
      badge.hidden = false;
    }

    function itemSrc(it) { return it.kind === 'packshot' ? img(curSku()) : it.src; }

    /* the stage is a horizontal track of slides that translateX between images,
       like the live shop, rather than one <img> whose src swaps in place */
    function buildTrack() {
      track.innerHTML = gallery.map(function (it, i) {
        var alt = it.kind === 'packshot' ? p.brand + ' ' + nameOf(p) : (it.alt || '');
        var cls = it.kind === 'packshot' ? (isBundle ? 'is-life' : 'is-packshot') : it.kind === 'item' ? 'is-packshot' : 'is-life';
        return '<div class="pdp-slide ' + cls + '" data-i="' + i + '">' +
          '<img src="' + esc(itemSrc(it)) + '" alt="' + esc(alt) + '"></div>';
      }).join('');
    }
    function renderStage() {
      /* keep the packshot slide on the current sku (colour/size may have changed) */
      [].forEach.call(track.querySelectorAll('.pdp-slide[data-i="0"] img'), function (im) {
        if (gallery[0].kind !== 'packshot') return;
        var s = img(curSku()); if (im.getAttribute('src') !== s) im.src = s;
      });
      track.style.transform = 'translateX(' + (-active * 100) + '%)';
      var it = gallery[active];
      flag.hidden = !it.video;
      var many = gallery.length > 1;
      prevBtn.hidden = nextBtn.hidden = !many;
      progress.hidden = !many;
      prevBtn.disabled = active === 0;
      nextBtn.disabled = active === gallery.length - 1;
      var seg = progress.querySelector('span');
      seg.style.width = (100 / gallery.length) + '%';
      seg.style.transform = 'translateX(' + (active * 100) + '%)';
    }
    function stepGallery(d) {
      active = Math.max(0, Math.min(gallery.length - 1, active + d));
      renderStage(); renderThumbs(); renderLightbox();
    }
    buildTrack();
    prevBtn.addEventListener('click', function () { stepGallery(-1); });
    nextBtn.addEventListener('click', function () { stepGallery(1); });

    /* swipe the stage on touch, the way the live gallery does on mobile */
    var swipeX = null;
    stage.addEventListener('touchstart', function (e) { swipeX = e.changedTouches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (swipeX == null) return;
      var dx = e.changedTouches[0].clientX - swipeX; swipeX = null;
      if (Math.abs(dx) > 40) stepGallery(dx < 0 ? 1 : -1);
    }, { passive: true });

    /* ---------- fullscreen lightbox (the live shop's gallery zoom) ---------- */
    var lightbox = document.getElementById('pdpLightbox');
    var zoomBtn = document.getElementById('pdpZoom');
    var LB_X = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
    var LB_L = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"/></svg>';
    var LB_R = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>';

    function lightboxOpen() { return lightbox && lightbox.getAttribute('aria-hidden') === 'false'; }
    function renderLightbox() {
      if (!lightboxOpen()) return;
      var it = gallery[active];
      var im = lightbox.querySelector('img');
      im.src = itemSrc(it);
      im.alt = it.kind === 'packshot' ? p.brand + ' ' + nameOf(p) : (it.alt || '');
      lightbox.querySelector('.lb-prev').disabled = active === 0;
      lightbox.querySelector('.lb-next').disabled = active === gallery.length - 1;
      lightbox.querySelector('.lb-count').textContent = (active + 1) + ' / ' + gallery.length;
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
    track.addEventListener('click', openLightbox);
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
      thumbsEl.style.display = gallery.length > 1 ? '' : 'none';   // no thumb strip for a single image
      thumbsEl.innerHTML = gallery.map(function (it, i) {
        var pack = it.kind === 'item' || (it.kind === 'packshot' && !isBundle);
        return '<button class="pdp-thumb' + (i === active ? ' sel' : '') + (pack ? ' is-packshot' : '') + '" data-i="' + i + '" aria-label="Image ' + (i + 1) + '">' +
          '<img src="' + esc(itemSrc(it)) + '" alt="">' + '</button>';
      }).join('');
    }
    thumbsEl.addEventListener('click', function (e) {
      var b = e.target.closest('.pdp-thumb'); if (!b) return;
      active = +b.dataset.i; renderStage(); renderThumbs();
    });

    /* ---------- buy box ---------- */
    var box = document.getElementById('buyBox');
    var accIdx = 0;
    var setOpen = false;   // "This bundle includes" — collapsed by default

    /* DS RatingStars: whole-star variants (the score text carries the decimal) */
    function starsHTML(r) {
      var n = Math.round(r), h = '';
      for (var i = 1; i <= 5; i++) h += '<img src="' + V2 + (i <= n ? 'star-full' : 'star-empty') + '.svg" width="20" height="20" alt="">';
      return '<span class="ds-stars" role="img" aria-label="' + esc(t('%r out of 5 stars').replace('%r', dec1(r))) + '">' + h + '</span>';
    }
    /* locale number formats: 4,2 and "10 %" in German */
    function dec1(r) { var s = r.toFixed(1); return lang === 'de' ? s.replace('.', ',') : s; }
    function pct(n) { return n + (lang === 'de' ? '\u00a0%' : '%'); }
    function reviewsLabel(r, n) {
      return '(' + dec1(r) + ') ' + n + ' ' + (n === 1 ? t('Review') : t('Reviews'));
    }
    /* DS PromoLabel — 20px, pill-right, 10/12 uppercase */
    function promoLabel(text, variant) {
      return '<span class="promo-label promo-label--' + variant + '">' + esc(text) + '</span>';
    }

    /* configurations of the same product family (single / with accessory / sets),
       tagged by bundleGroup in the catalog; ordered single → accessory → sets */
    function bundleRank(o) {
      var m = /Set of (\d+)/i.exec(o.bundleLabel || '');
      if (m) return 10 + (+m[1]);
      return /^with/i.test(o.bundleLabel || '') ? 5 : 0;
    }
    /* explicit order when the catalog sets one — a bundle that builds on a set
       (set of 3 + protectors) can't be placed from its label alone */
    function bundleSort(a, b) {
      var ao = a.bundleOrder, bo = b.bundleOrder;
      if (ao != null && bo != null) return ao - bo;
      return bundleRank(a) - bundleRank(b);
    }
    var bundleOpts = p.bundleGroup
      ? products.filter(function (x) { return x.bundleGroup === p.bundleGroup; }).sort(bundleSort)
      : [];
    /* a product whose own variants are set configurations rather than sizes */
    var setVariants = p.variants.length > 1 && !p.sizes.length &&
      p.variants.every(function (vv) { return /^Set of \d/i.test(vv.size || ''); });

    function titleFor(v) {
      return /^\d+\s*cm$/i.test(v.size) ? nameOf(p) + ', ' + v.size : nameOf(p);
    }
    function curVariant() {
      var v = p.variants[sel];
      if (p.colors) {   // the selected colour drives price / sku / stock
        var col = p.colors[colorSel];
        v = { sku: col.sku, size: v.size, price: col.price, msrp: col.msrp || null, sale: col.sale, stock: col.stock !== false, label: null };
      }
      return v;
    }

    function buyBoxHTML() {
      var v = curVariant();
      var onSale = !isBundle && isSale(v);
      var reduction = onSale ? Math.round((1 - v.price / v.msrp) * 100) : 0;
      var klarna = (v.price / 3).toFixed(2);
      if (lang === 'de') klarna = klarna.replace('.', ',');
      var points = Math.round(v.price);
      var h = '';

      /* ---- Product information · series / title / rating ---- */
      h += '<div class="bb-info">';
      if (p.series) {
        var catPage = CAT_PAGE[catKey] || 'pans.html';
        h += '<a class="bb-eyebrow" href="' + catPage + '?series=' + encodeURIComponent(p.series) + '">' + esc(p.series) + '</a>';
      } else if (info.eyebrow) {
        h += '<a class="bb-eyebrow" href="' + (CAT_PAGE[catKey] || 'pans.html') + '">' + esc(loc(info, 'eyebrow')) + '</a>';
      } else {
        h += '<span class="bb-eyebrow">' + esc(p.brand) + '</span>';
      }
      h += '<h1 class="bb-title">' + esc(titleFor(v)) + '</h1>';
      /* RatingStars with the review-verification notice — bundles have no
         reviews of their own, so no set rating is shown (each item carries its own) */
      if (p.rating != null && p.reviews) {
        h += '<div class="bb-rating"><a href="#accReviews" data-act="reviews">' + starsHTML(p.rating) +
          '<span class="rating-count">' + reviewsLabel(p.rating, p.reviews) + '</span></a>' +
          '<button class="bb-ibtn" data-act="review-info" aria-label="' + esc(t('About our reviews')) + '">' + ICONS.circledI + '</button></div>';
      }
      h += '</div>';

      /* ---- Price Summary (Original and History) ---- */
      h += '<div class="bb-price">' +
        '<div class="bb-price-now"><span class="bb-price-cur' + (onSale ? ' sale' : '') + '">' + eur(v.price) + '</span>' +
        '<span class="bb-price-vat">' + t('VAT included, plus') + ' <a href="#" data-act="shipping">' + t('shipping (free shipping on orders over €49)') + '</a></span></div>';
      if (onSale) {
        h += '<div class="bb-price-low"><span>' + t('Last lowest price:') + '</span>' +
          '<s>' + eur(v.msrp) + '</s><span class="bb-price-red">−' + pct(reduction) + '</span>' +
          '<button class="bb-ibtn" data-act="price-history" aria-label="' + esc(t("This item's price history")) + '">' + ICONS.circledI + '</button></div>';
      }
      h += '</div>';

      /* bundle: the saving vs. buying the items individually — a plain set
         price, never a strikethrough / 30-day reduction (that's not what it is) */
      if (isBundle) {
        var save = savingOf(p, v), total = setValue(p, v);
        if (save > 0) {
          h += '<p class="bb-setsave"><span class="g">' + t('You save %s (%p)').replace('%s', eur(save)).replace('%p', pct(Math.round(save / total * 100))) +
            '</span> ' + t('compared to buying individually') + '</p>';
        }
      }

      /* ---- Product selection ---- */
      var selH = '';
      // colour swatches (66px packshot tiles, selected outlined black)
      if (p.colors) {
        selH += '<div class="bb-sel bb-colors"><div class="bb-sel-head"><span class="bb-sel-lbl">' + t('Color:') + '</span>' +
          '<span class="bb-sel-val bb-color-name">' + esc(p.colors[colorSel].name) + '</span></div>' +
          '<div class="bb-swatches">' + p.colors.map(function (c, i) {
            return '<button class="bb-swatch' + (i === colorSel ? ' sel' : '') + (c.stock === false ? ' oos' : '') +
              '" data-color="' + i + '" title="' + esc(c.name + (c.stock === false ? ' · ' + t('Out of stock') : '')) + '" aria-label="' + esc(c.name) + '">' +
              '<img src="' + img(c.sku) + '" alt=""></button>';
          }).join('') + '</div></div>';
      }
      // size chips with serving guidance — only for a real size choice
      if (p.sizes.length > 1) {
        selH += '<div class="bb-sel bb-sizes"><div class="bb-sel-head"><span class="bb-sel-lbl">' + t('Size:') + '</span>' +
          '<span class="bb-sel-val">' + esc(t(v.size)) + '</span>' +
          '<a href="#" class="bb-sizeguide" data-act="size-guide">' + t('Size Guide') + '</a></div>' +
          '<div class="bb-size-chips">' + p.variants.map(function (vv, i) {
            var hint = SIZE_HINTS[vv.size];
            return '<button class="bb-size' + (i === sel ? ' sel' : '') + (vv.stock ? '' : ' oos') + '" data-i="' + i + '"' +
              (vv.stock ? '' : ' title="' + esc(t('Out of stock')) + '"') + '>' +
              '<span class="sz">' + esc(t(vv.size)) + '</span>' + (hint ? '<span class="hint">' + esc(t(hint)) + '</span>' : '') + '</button>';
          }).join('') + '</div></div>';
      }
      // Options — set / bundle configurations (DS Product Option Card)
      selH += optionsHTML();
      // bundle contents — collapsible box, each item with its own rating
      if (isBundle && items.length) selH += setBoxHTML(v);
      if (selH) h += '<div class="bb-selection">' + selH + '</div>';

      /* ---- Delivery / Click & Collect ---- */
      h += '<div class="bb-delivery">' +
        '<div class="bb-del-row"><span class="bb-del-head">' + ICONS.truck + t('Online Delivery') + '</span>' +
        (v.stock
          ? '<span class="bb-del-line">' + ICONS.dot + t('Available Immediately - delivered in 1-3 days') + '</span>'
          : '<span class="bb-del-line warn"><span class="dot"></span>' + t('Out of stock online - back soon') + '</span>') +
        '</div>' +
        '<div class="bb-del-row"><span class="bb-del-head">' + ICONS.pin + 'Click &amp; Collect</span>' +
        '<span class="bb-del-line">' + ICONS.dot + t('Available in Würzburg') + ' | <a href="#">' + t('Change Store') + '</a></span></div></div>';

      /* ---- Purchase & benefits ---- */
      h += '<div class="bb-purchase">';
      h += '<div class="bb-cta-row">' +
        '<button class="bb-cta" data-act="add"' + (v.stock ? '' : ' disabled') + '>' + (v.stock ? t('Add to cart') : t('Out of stock')) + '</button>' +
        '<button class="bb-wish" data-act="wish" aria-label="' + esc(t('Add to wishlist')) + '">' + ICONS.wish + '</button></div>';

      var adv = loc(info, 'advantages');
      if (isBundle && adv && adv.length) {
        /* the set's own advantages replace the upsell (its items are already in the set) */
        h += '<div class="bb-adv"><h3 class="bb-h">' + t('Advantages of the set') + '</h3><ul>' +
          adv.map(function (a) { return '<li><b>' + esc(a[0]) + '</b> ' + esc(a[1]) + '</li>'; }).join('') + '</ul></div>';
      } else {
        h += '<div class="bb-acc-block"><h3 class="bb-h">' + t('Also add to your cart') + '</h3>' +
          '<div class="bb-acc-viewport"><div class="bb-acc-track" style="transform:translateX(-' + (accIdx * 100) + '%)">' +
          ACCESSORIES.map(function (acc) {
            return '<div class="bb-acc"><span class="bb-acc-img"><img src="' + acc.img + '" alt=""></span>' +
              '<span class="bb-acc-body"><span>' + esc(t(acc.name)) + '</span><span>' + eur(acc.price) + '</span></span>' +
              '<button class="bb-acc-add" data-act="acc-add" aria-label="' + esc(t('Add to cart') + ': ' + t(acc.name)) + '">' + ICONS.cart + '</button></div>';
          }).join('') + '</div></div></div>';
      }

      h += '<div class="bb-bar"><img src="' + V2 + 'mywmf.svg" width="34" height="24" alt="myWMF">' +
        '<span>' + t('Earn <b>%n Club Points</b> with this purchase').replace('%n', points) + '</span>' +
        '<button class="bar-info" data-act="club-info" aria-label="' + esc(t('About Club Points')) + '">' + ICONS.info + '</button></div>';
      h += '<div class="bb-bar"><img src="assets/pdp/klarna.png" width="42" height="18" alt="Klarna">' +
        '<span>' + t('3 payments of %x € at 0% interest with Klarna').replace('%x', klarna) + ' <a href="#">' + t('Learn more') + '</a></span></div>';
      h += '<ul class="bb-benefits">' + BENEFITS.map(function (b) {
        return '<li><img src="' + V2 + b.icon + '" width="24" height="24" alt="">' + esc(t(b.label)) + '</li>';
      }).join('') + '</ul>';
      h += '</div>';
      return h;
    }

    /* ---- Options: DS Product Option Card (Single / Bundle / Featured bundle).
       Name + "What's included" (hover or tap shows the contents), price, and for
       sets the saving vs. the items' total; the largest saving gets Best value. */
    function optionCard(o, ov, name, contents, isSel, isBest, attrs, tag) {
      /* the saving shows on sets only (a single bundled with an accessory has no set price) */
      var save = o.type === 'Set' ? savingOf(o, ov) : 0;
      var tip = contents && contents.length
        ? '<span class="opt-tip" role="tooltip"><span class="opt-tip-h">' + t(o.type === 'Set' ? 'Included in this set' : 'Included in this bundle') + '</span>' +
          contents.map(function (b) { return '<span class="opt-tip-i">' + (b.qty || 1) + ' × ' + esc((lang === 'de' && b.name_de) || t(b.name)) + '</span>'; }).join('') + '</span>'
        : '';
      return '<' + tag + ' class="opt' + (isSel ? ' sel' : '') + (ov.stock === false ? ' oos' : '') + '"' + attrs + '>' +
        '<span class="opt-img"><img src="' + img(ov.sku) + '" alt=""></span>' +
        '<span class="opt-body"><span class="opt-name">' + esc(name) + '</span>' +
          (tip ? '<span class="opt-inc" data-inc role="button" tabindex="0" aria-expanded="false">' + t("What's included") + '</span>' : '') + '</span>' +
        '<span class="opt-price">' + (isBest ? promoLabel(t('Best value'), 'sale') : '') +
          '<span>' + eur(ov.price) + '</span>' +
          (save > 0 ? '<span class="opt-save">' + t('You save %s').replace('%s', eur(save)) + '</span>' : '') +
        '</span>' + tip + '</' + tag + '>';
    }
    function optionsHTML() {
      var cards = '';
      if (setVariants) {
        var bestIdx = -1, bestSav = 0;
        p.variants.forEach(function (vv, i) { var s = savingOf(p, vv); if (s > bestSav) { bestSav = s; bestIdx = i; } });
        cards = p.variants.map(function (vv, i) {
          return optionCard(p, vv, nameOf(p) + ' · ' + t(vv.size), p.bundle, i === sel, i === bestIdx,
            ' data-i="' + i + '"' + (i === sel ? ' aria-current="true"' : ''), 'button');
        }).join('');
      } else if (bundleOpts.length > 1) {
        var bestId = null, best = 0;
        bundleOpts.forEach(function (o) {
          var ov = o.variants[o.default] || o.variants[0];
          if (o.type === 'Set') { var s = savingOf(o, ov); if (s > best) { best = s; bestId = o.id; } }
        });
        cards = bundleOpts.map(function (o) {
          var ov = o.variants[o.default] || o.variants[0];
          var mine = o.id === p.id;
          return optionCard(o, ov, nameOf(o), o.bundle, mine, o.id === bestId,
            mine ? ' aria-current="true"' : ' href="product.html?id=' + o.id + '"', mine ? 'span' : 'a');
        }).join('');
      }
      if (!cards) return '';
      return '<div class="bb-sel bb-options"><div class="bb-sel-head"><span class="bb-sel-lbl">' + t('Options') + '</span></div>' +
        '<div class="opt-rows">' + cards + '</div></div>';
    }

    /* ---- "This bundle includes" (Figma component 3250:2914): collapsed header
       with item thumbnails; expanded rows show each item's price and its own
       rating (no aggregated set rating), then the set value summary. ---- */
    function setBoxHTML(v) {
      var n = items.length;
      var total = setValue(p, v), save = savingOf(p, v);
      var h = '<div class="setbox' + (setOpen ? ' open' : '') + '">' +
        '<button class="setbox-head" data-act="setbox" aria-expanded="' + setOpen + '">' +
        '<span class="setbox-thumbs">' + items.slice(0, 4).map(function (c) { return '<span><img src="' + esc(c.img) + '" alt=""></span>'; }).join('') + '</span>' +
        '<span class="setbox-title">' + t(n === 1 ? 'This bundle includes 1 product' : 'This bundle includes %n products').replace('%n', n) + '</span>' +
        '<span class="setbox-chev">' + ICONS.chevDown + '</span></button>' +
        '<div class="setbox-body">';
      h += items.map(function (c) {
        var nm = c.qty + ' × ' + esc(c.name);
        return '<div class="setbox-item"><span class="setbox-img"><img src="' + esc(c.img) + '" alt=""></span>' +
          '<span class="setbox-main"><span class="setbox-line">' +
            (c.href ? '<a href="' + c.href + '">' + nm + '</a>' : '<span>' + nm + '</span>') +
            (c.price != null ? '<span class="setbox-price">' + eur(c.price) + '</span>' : '') + '</span>' +
            (c.rating != null && c.reviews
              ? (c.href ? '<a class="setbox-rating" href="' + c.href + '#reviews">' : '<span class="setbox-rating">') +
                starsHTML(c.rating) + '<span>' + reviewsLabel(c.rating, c.reviews) + '</span>' + (c.href ? '</a>' : '</span>')
              : '') +
          '</span></div>';
      }).join('');
      if (save > 0) {
        h += '<div class="setbox-sum">' +
          '<div><span>' + t('Bought individually') + '</span><span>' + eur(total) + '</span></div>' +
          '<div class="b"><span>' + t('Set price') + '</span><span>' + eur(v.price) + '</span></div>' +
          '<div class="g"><span>' + t('Your saving') + '</span><span>' + eur(save) + ' (' + pct(Math.round(save / total * 100)) + ')</span></div></div>';
      }
      return h + '</div></div>';
    }

    function renderBuyBox() { box.innerHTML = buyBoxHTML(); }

    function bumpCart() {
      // shared session cart (assets/app.js renders tile + header badges from it)
      var cid = new URLSearchParams(location.search).get('id') || 'pdp';
      var cart = {};
      try { cart = JSON.parse(sessionStorage.getItem('wmf.plp.cart')) || {}; } catch (e) {}
      cart[cid] = (cart[cid] || 0) + 1;
      try { sessionStorage.setItem('wmf.plp.cart', JSON.stringify(cart)); } catch (e) {}
      var el = document.getElementById('cartCount');
      if (el) {
        var total = Object.keys(cart).reduce(function (s, k) { return s + cart[k]; }, 0);
        el.textContent = total; el.hidden = !total;
      }
    }

    function closeIncluded() {
      [].forEach.call(box.querySelectorAll('.opt-tip.open'), function (x) { x.classList.remove('open'); });
      [].forEach.call(box.querySelectorAll('.opt-inc[aria-expanded="true"]'), function (x) { x.setAttribute('aria-expanded', 'false'); });
    }
    box.addEventListener('click', function (e) {
      /* "What's included" toggle — pins the contents card open (mobile tap) and
         must run before the card's select/navigate, whose default it cancels */
      var inc = e.target.closest('[data-inc]');
      if (inc) {
        e.preventDefault();
        var opt = inc.closest('.opt');
        var tip = opt && opt.querySelector('.opt-tip');
        var wasOpen = tip && tip.classList.contains('open');
        closeIncluded();
        if (tip && !wasOpen) { tip.classList.add('open'); inc.setAttribute('aria-expanded', 'true'); }
        return;
      }
      var swatch = e.target.closest('.bb-swatch');
      if (swatch) {
        colorSel = +swatch.dataset.color;
        renderBuyBox(); renderStage(); renderThumbs(); renderTech();
        return;
      }
      /* size chips and in-product set configurations both pick a variant */
      var size = e.target.closest('.bb-size, .opt[data-i]');
      if (size) {
        sel = +size.dataset.i;
        renderBuyBox(); renderStage(); renderThumbs(); renderTech();
        return;
      }
      var act = e.target.closest('[data-act]');
      if (!act) return;
      var a = act.getAttribute('data-act');
      if (a === 'add') {
        bumpCart();
        act.classList.add('added'); act.textContent = t('Added ✓');
        setTimeout(function () { act.classList.remove('added'); act.textContent = t('Add to cart'); }, 1400);
      }
      else if (a === 'setbox') {
        setOpen = !setOpen;
        var sb = act.closest('.setbox');
        sb.classList.toggle('open', setOpen);
        act.setAttribute('aria-expanded', setOpen);
      }
      else if (a === 'acc-add') { bumpCart(); }
      else if (a === 'wish') { act.classList.toggle('on'); }
      else if (a === 'reviews') { e.preventDefault(); openAcc('accReviews', true); }
      else if (a === 'size-guide') { e.preventDefault(); openModal(sizeGuideHTML()); }
      else if (a === 'club-info') { openModal(clubHTML()); }
      else if (a === 'price-history') { openModal(priceHistoryHTML()); }
      else if (a === 'review-info') { openModal(reviewInfoHTML()); }
      else if (a === 'shipping') { e.preventDefault(); openModal(shippingHTML()); }
    });
    /* keyboard-toggle the "What's included" card, and dismiss it on outside click */
    box.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.closest && e.target.closest('[data-inc]')) {
        e.preventDefault(); e.target.click();
      }
    });
    document.addEventListener('click', function (e) {
      if (e.target.closest && (e.target.closest('[data-inc]') || e.target.closest('.opt-tip'))) return;
      closeIncluded();
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

    /* "Also add to your cart" — one accessory at a time; swipe for the next
       (the Figma keeps the slider arrows hidden) */
    var accX = null;
    box.addEventListener('touchstart', function (e) {
      if (e.target.closest('.bb-acc-viewport')) accX = e.changedTouches[0].clientX;
    }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (accX == null) return;
      var dx = e.changedTouches[0].clientX - accX; accX = null;
      if (Math.abs(dx) < 40) return;
      accIdx = Math.max(0, Math.min(ACCESSORIES.length - 1, accIdx + (dx < 0 ? 1 : -1)));
      var tr = box.querySelector('.bb-acc-track');
      if (tr) tr.style.transform = 'translateX(-' + (accIdx * 100) + '%)';
    }, { passive: true });

    /* ---------- modals (size guide / club points / price history / reviews / shipping) ---------- */
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
        '<p class="pm-note">' + t('Frying pan sizes are measured across the top rim — the usable cooking surface is roughly 4 cm smaller. When in doubt, size up: food browns better with room around it.') + '</p>' +
        '<div class="sg-table"><div class="sg-row head"><span>' + t('Size') + '</span><span>' + t('Serves') + '</span><span>' + t('Typical use') + '</span></div>' + rows + '</div>' +
        '<p class="pm-note">' + esc(isSet
          ? t('The %name combines the most-used sizes in one set (%sizes).').replace('%name', nameOf(p)).replace('%sizes', p.sizes.map(function (x) { return t(x); }).join(', '))
          : t('The %name is available in %sizes — ticked above.').replace('%name', nameOf(p)).replace('%sizes', p.sizes.join(lang === 'de' ? ' und ' : ' and '))) + '</p>';
    }

    function clubHTML() {
      var pts = Math.round(curVariant().price);
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

    /* Price History Dialog (Figma "Price Variations") — the reduction is always
       calculated against the lowest price of the last 30 days */
    function priceHistoryHTML() {
      var v = curVariant();
      var red = Math.round((1 - v.price / v.msrp) * 100);
      return '<h3 class="pm-caps">' + t("This item's price history") + '</h3>' +
        '<p class="ph-step">1. ' + t('How much this item costs today') + '</p>' +
        '<p class="ph-now"><span class="bb-price-cur sale">' + eur(v.price) + '</span> <span class="bb-price-vat">' + t('VAT included, plus') + ' <u>' + t('shipping (free shipping on orders over €49)') + '</u></span></p>' +
        '<p class="ph-step">2. ' + t('The lowest price in the last 30 days') + '</p>' +
        '<p class="ph-low"><s>' + eur(v.msrp) + '</s> <span class="bb-price-red">−' + pct(red) + '</span></p>' +
        '<p class="pm-note">' + t('The original price is the same as the last lowest price.') + '</p>';
    }
    function reviewInfoHTML() {
      return '<h3 class="pm-caps">' + t('About our reviews') + '</h3>' +
        '<p class="pm-note">' + t('Ratings and reviews are written by customers. Find out how reviews are collected and checked in our review policy.') + '</p>';
    }
    function shippingHTML() {
      return '<h3 class="pm-caps">' + t('Shipping costs') + '</h3>' +
        '<p class="pm-note">' + t('Orders of €49 or more ship free of charge. Below that we charge €4.95 per order.') + '</p>';
    }

    /* ---------- accordions (Product Details open by default) ---------- */
    function openAcc(accId, scroll) {
      var a = document.getElementById(accId); if (!a || a.hidden) return;
      a.classList.add('open');
      a.querySelector('.pdp-acc-head').setAttribute('aria-expanded', 'true');
      if (scroll) a.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    document.querySelectorAll('.pdp-acc-head').forEach(function (b) {
      b.addEventListener('click', function () {
        var a = b.closest('.pdp-acc');
        var open = a.classList.toggle('open');
        b.setAttribute('aria-expanded', open);
      });
    });
    if (location.hash === '#reviews') openAcc('accReviews', true);

    /* ---------- Product Details: feature tiles + long description ---------- */
    var feats = isHero ? HERO_FEATURES.map(function (f) {
      return { img: f.img, title: t(f.title), html: tt(f.key, f.text) };
    }) : (info.details || []).map(function (d) {
      return { img: d.img, title: loc(d, 'title'), html: esc(loc(d, 'text')) };
    });
    var featEl = document.getElementById('pdpFeatures');
    if (featEl) {
      if (feats.length) {
        featEl.innerHTML = feats.map(function (f) {
          return '<article class="feat"><img src="' + esc(f.img) + '" alt="" loading="lazy"><h3>' + esc(f.title) + '</h3><p>' + f.html + '</p></article>';
        }).join('');
      } else featEl.hidden = true;
    }
    var descTitle = isHero ? t(HERO_DESC.title) : (info.descTitle ? loc(info, 'descTitle') : nameOf(p));
    var descText = isHero ? tt('desc:heroLong', HERO_DESC.text) : descOf(p);
    var dT = document.getElementById('pdpDescTitle'), dX = document.getElementById('pdpDescText');
    if (descText) { dT.textContent = descTitle; dX.textContent = descText; }
    else document.getElementById('pdpLongDesc').hidden = true;
    /* the pans range comparison belongs on pan PDPs only */
    var cmp = document.getElementById('compare');
    if (cmp) cmp.hidden = !(p.cats && ('frying-pans' in p.cats || 'pans' in p.cats));

    /* ---------- Scope of delivery ---------- */
    var scope = document.getElementById('scopeList');
    if (scope) {
      var lines = p.bundle && p.bundle.length
        ? p.bundle.map(function (b) { return (b.qty || 1) + ' × ' + ((lang === 'de' && b.name_de) || t(b.name)); })
        : ['1 × ' + titleFor(p.variants[sel])];
      scope.innerHTML = lines.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('');
    }

    /* ---------- reviews ----------
       Real reviews scraped from the German shop (see README). A bundle has no
       reviews of its own — the accordion is hidden; each item shows its rating. */
    var revAcc = document.getElementById('accReviews');
    var list = document.getElementById('reviewsList');
    if (isBundle && !p.reviews) {
      if (revAcc) revAcc.hidden = true;
    } else if (list) {
      var revs = p.reviewItems || [];
      if (revs.length) {
        list.innerHTML = revs.map(function (r) {
          var title = (lang === 'de' ? r.title_de : r.title) || '';
          var text = (lang === 'de' ? r.text_de : r.text) || '';
          return '<article class="review">' + starsHTML(r.stars || 0) +
            '<div class="review-meta"><span class="review-name">' + esc(r.name) + '</span><span class="review-date">' + esc(r.date) + '</span></div>' +
            '<h4>' + esc(title) + '</h4><p>' + esc(text) + '</p></article>';
        }).join('') +
        (p.reviews > revs.length ? '<div class="reviews-more"><button class="btn-outline">' + t('Show more +') + '</button></div>' : '');
      } else {
        list.innerHTML = '<p class="reviews-none">' + t('No reviews yet — be the first to review this product.') + '</p>';
      }
    }

    /* ---------- technical data (a bundle lists one group per item) ---------- */
    function techRows(rows) {
      return '<dl class="tech-table">' + rows.filter(function (r) { return r[1]; }).map(function (r) {
        return '<dt>' + esc(t(r[0])) + '</dt><dd>' + esc(r[1]) + '</dd>';
      }).join('') + '</dl>';
    }
    function renderTech() {
      var tech = document.getElementById('techData'); if (!tech) return;
      if (isBundle && items.length) {
        tech.innerHTML = items.map(function (c) {
          return '<h4 class="tech-group">' + esc(c.name) + '</h4>' +
            techRows([['Article number', c.sku]].concat(c.tech || []));
        }).join('');
        return;
      }
      tech.innerHTML = techRows([
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
      ]);
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
          var prod = byId(card.getAttribute('data-id'));
          if (!prod) return;
          prod._sel = parseInt(sw.dataset.i, 10);
          card.outerHTML = api.cardHTML(prod);
        });
      } else {
        var blk = document.getElementById('xsAlternativesBlock'); if (blk) blk.hidden = true;
      }
    }

    /* ---------- boot ---------- */
    renderStage(); renderThumbs(); renderBuyBox(); renderTech();
  }

  window.renderPDP = renderPDP;
})();
