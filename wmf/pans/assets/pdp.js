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

  /* Example reviews from the Figma mock (real-shop style). Shown only on
     products that actually have reviews; capped at the real review count. */
  var EXAMPLE_REVIEWS = [
    { name: 'Tobias', date: '31.12.25', title: 'Great pan', text: 'The pan cooks evenly and nothing sticks. It’s also easy to wash by hand.' },
    { name: 'Irene Sänger', date: '16.10.25', title: 'Top', text: 'Exactly as described. Excellent.' },
    { name: 'Schiffmann', date: '15.10.25', title: 'Professional Resist frying pan', text: 'I saw it at a friend’s house and bought it myself. Nothing sticks, great browning. Versatile pan.' }
  ];

  var SIZE_HINTS = { '20 cm': '1 – 2 people', '24 cm': '2 – 4 people', '28 cm': '4 – 6 people' };

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
    var products = DATA.products;

    var id = new URLSearchParams(location.search).get('id') || 'p1';
    var p = products.find(function (x) { return x.id === id; }) || products.find(function (x) { return x.id === 'p1'; }) || products[0];
    if (!p) return;
    var sel = p.default || 0;
    var isHero = p.series === HERO_SERIES;

    document.title = 'WMF · ' + p.name;

    /* ---------- breadcrumb (catalog category trails) ---------- */
    var catKey = p.cats && ('frying-pans' in p.cats) ? 'frying-pans' : 'pans';
    var CAT_HREF = { 'Home': 'index.html', 'Products': 'pans.html', 'Pans': 'pans.html', 'Frying Pans': 'frying-pans.html' };
    var trail = (DATA.categories && DATA.categories[catKey] && DATA.categories[catKey].breadcrumb) || ['Home', 'Products', 'Pans'];
    var crumbs = document.getElementById('pdpCrumbs');
    if (crumbs) {
      crumbs.innerHTML = trail.map(function (t) {
        var href = CAT_HREF[t];
        return '<li>' + (href ? '<a href="' + href + '">' + esc(t) + '</a>' : esc(t)) + '</li>';
      }).join('') + '<li>' + esc(p.name) + '</li>';
    }

    /* ---------- gallery ---------- */
    var items = [];
    if (isHero) {
      items = HERO_GALLERY.slice();
      items.splice(1, 0, { kind: 'packshot' });   // real product photo as 2nd thumb
    } else {
      items = [{ kind: 'packshot' }, { src: 'assets/inuse.jpg', kind: 'life', alt: 'The pan in use' }];
    }
    var active = 0;

    var stage = document.getElementById('pdpStage');
    var mainImg = document.getElementById('pdpMain');
    var flag = document.getElementById('pdpVideoFlag');
    var thumbsEl = document.getElementById('pdpThumbs');

    function itemSrc(it) { return it.kind === 'packshot' ? img(p.variants[sel].sku) : it.src; }
    function renderStage() {
      var it = items[active];
      mainImg.src = itemSrc(it);
      mainImg.alt = it.kind === 'packshot' ? p.brand + ' ' + p.name : (it.alt || '');
      stage.classList.toggle('is-packshot', it.kind === 'packshot');
      flag.hidden = !it.video;
    }
    function renderThumbs() {
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
      info: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 10.8v5" stroke-linecap="round"/><circle cx="12" cy="7.6" r="1" fill="currentColor" stroke="none"/></svg>',
      truck: '<svg width="22" height="15" viewBox="0 0 24 16" fill="none" stroke="#1a1a1a" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1.5h13v10H1z"/><path d="M14 5h4.5L22 8.6v2.9h-8"/><circle cx="5.4" cy="13" r="1.9" fill="#fff"/><circle cx="17.6" cy="13" r="1.9" fill="#fff"/></svg>',
      store: '<svg width="18" height="16" viewBox="0 0 24 22" fill="none" stroke="#1a1a1a" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8 4.5 2h15L21 8"/><path d="M3 8c0 1.6 1.3 3 3 3s3-1.4 3-3c0 1.6 1.3 3 3 3s3-1.4 3-3c0 1.6 1.3 3 3 3s3-1.4 3-3"/><path d="M5 11v9h14v-9"/><path d="M10 20v-6h4v6"/></svg>',
      ret: '<svg width="20" height="15" viewBox="0 0 24 18" fill="none" stroke="#1a1a1a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h11a5 5 0 0 1 0 10H8"/><path d="m8 3-4 4 4 4"/></svg>',
      crown: '<svg width="18" height="15" viewBox="0 0 24 20" fill="none" stroke="#1a1a1a" stroke-width="1.5" stroke-linejoin="round"><path d="M3 6l4 4 5-6 5 6 4-4-1.5 11h-15L3 6Z"/></svg>',
      heart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21.5l8.8-8.8a5 5 0 0 0 0-7.1Z"/></svg>'
    };

    var setProduct = products.find(function (x) { return x.series === p.series && x.type === 'Set' && x.id !== p.id; });

    function titleFor(v) {
      return /^\d+\s*cm$/i.test(v.size) ? p.name + ', ' + v.size : p.name;
    }
    function shortDesc(full) {
      if (!full) return '';
      if (full.length <= 150) return full;
      var cut = full.slice(0, 150);
      return cut.slice(0, cut.lastIndexOf(' ')) + '…';
    }

    function buyBoxHTML() {
      var v = p.variants[sel];
      var onSale = isSale(v);
      var save = onSale ? Math.round((1 - v.price / v.msrp) * 100) : 0;
      var klarna = (v.price / 3).toFixed(2);
      var points = Math.round(v.price);
      var h = '';

      h += '<span class="bb-eyebrow">' + esc(p.series || p.brand) + '</span>';
      h += '<h1 class="bb-title">' + esc(titleFor(v)) + '</h1>';

      if (p.description) {
        h += '<p class="bb-desc">' + esc(descOpen ? p.description : shortDesc(p.description)) + '</p>';
        if (p.description.length > 150) {
          h += '<button class="bb-readmore" data-act="readmore" aria-expanded="' + descOpen + '">' + (descOpen ? 'Read less' : 'Read more') + '</button>';
        }
      }

      if (p.rating != null) {
        h += '<a class="bb-rating" href="#reviews">' +
          '<span class="stars" style="--pct:' + Math.round(p.rating / 5 * 100) + '%"></span>' +
          '<span class="rating-count">(' + p.rating.toFixed(1) + ') ' + p.reviews + ' Review' + (p.reviews === 1 ? '' : 's') + '</span></a>';
      }

      /* Price Display component (Figma 1621:6329) — Default / Discount variants */
      h += '<div class="bb-price-row">' +
        '<span class="bb-price' + (onSale ? ' sale' : '') + '">' + eur(v.price) + '</span>' +
        (onSale ? '<span class="discount">Save ' + save + '%</span>' : '') +
        '</div>';
      if (onSale) h += '<p class="bb-was">' + eur(v.msrp) + ' (last 30 days lowest price)</p>';
      h += '<p class="bb-vat">Including VAT <span class="bb-shiphint">' +
        (onSale ? 'shipping (free shipping on orders over €49)' : '(free shipping on orders over €49)') +
        '</span></p>';

      h += '<div class="bb-bar bb-bar--klarna"><img src="assets/pdp/klarna.png" alt="Klarna">' +
        '<span>3 payments of ' + klarna + ' € at 0% interest with Klarna <a href="#">Learn more</a></span>' +
        '<button class="bar-info" aria-label="More about Klarna">' + ICONS.info + '</button></div>';

      h += '<div class="bb-bar bb-bar--club"><img src="assets/pdp/mywmf.png" alt="myWMF">' +
        '<span>Earn <b>' + points + '</b> Club Points with this purchase</span>' +
        '<button class="bar-info" data-act="club-info" aria-label="About Club Points">' + ICONS.info + '</button></div>';

      if (setProduct) {
        var sv = setProduct.variants[setProduct.default] || setProduct.variants[0];
        var sSave = isSale(sv) ? Math.round(sv.msrp - sv.price) : 0;
        h += '<a class="bb-set" href="product.html?id=' + setProduct.id + '">' +
          '<img src="' + img(sv.sku) + '" alt="">' +
          '<span><span class="bb-set-name">' + esc(setProduct.name) + ' <small>(' + esc(sv.size) + ')</small></span>' +
          '<span class="bb-set-price">' + eur(sv.price) +
          (sSave ? '<span class="discount">Save €' + sSave + '</span>' : '') + '</span></span></a>';
      }

      h += '<div class="bb-sizes"><div class="bb-sizes-head"><span class="lbl">Size:</span><a href="#" data-act="size-guide">Size Guide</a></div>' +
        '<div class="bb-size-chips">' + p.variants.map(function (vv, i) {
          var hint = SIZE_HINTS[vv.size];
          return '<button class="bb-size' + (i === sel ? ' sel' : '') + (vv.stock ? '' : ' oos') + '" data-i="' + i + '"' +
            ' title="' + esc((hint ? hint + (vv.stock ? '' : ' · out of stock') : (vv.stock ? '' : 'Out of stock'))) + '">' +
            esc(vv.size) + '</button>';
        }).join('') + '</div></div>';

      h += '<div class="bb-acc-head"><span class="lbl">Add Accessories:</span>' +
        '<span class="bb-acc-nav">' +
        '<button class="bb-acc-arrow" data-act="acc-prev" aria-label="Previous accessory"' + (accIdx === 0 ? ' disabled' : '') + '>' +
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"/></svg></button>' +
        '<button class="bb-acc-arrow" data-act="acc-next" aria-label="Next accessory"' + (accIdx === ACCESSORIES.length - 1 ? ' disabled' : '') + '>' +
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg></button>' +
        '</span></div>' +
        '<div class="bb-acc-viewport"><div class="bb-acc-track" style="transform:translateX(-' + (accIdx * 100) + '%)">' +
        ACCESSORIES.map(function (acc) {
          return '<div class="bb-acc"><img src="' + acc.img + '" alt="">' +
            '<span><span class="bb-acc-name">' + esc(acc.name) + '</span><br><span class="bb-acc-price">€ ' + acc.price.toFixed(2) + '</span></span>' +
            '<button class="bb-acc-add" data-act="acc-add">Add to Cart</button></div>';
        }).join('') + '</div></div>';

      h += '<div class="bb-delivery">' +
        '<div class="bb-del-row"><span class="bb-del-head">' + ICONS.truck + ' Online Delivery ' + ICONS.info + '</span>' +
        (v.stock
          ? '<span class="bb-del-line"><span class="dot"></span>Available Immediately - delivered in 1-3 days</span>'
          : '<span class="bb-del-line warn"><span class="dot"></span>Out of stock online - back soon</span>') +
        '</div>' +
        '<div class="bb-del-row"><span class="bb-del-head">' + ICONS.store + ' Click &amp; Collect</span>' +
        '<span class="bb-del-line"><span class="dot"></span>Available in Würzburg <a href="#">Change Store</a></span></div></div>';

      h += '<div class="bb-cta-row">' +
        '<button class="bb-cta" data-act="add"' + (v.stock ? '' : ' disabled') + '>' + (v.stock ? 'Add to cart' : 'Out of stock') + '</button>' +
        '<button class="bb-wish" data-act="wish" aria-label="Add to wishlist">' + ICONS.heart + '</button></div>';

      h += '<div class="bb-trust">' +
        '<div class="bb-trust-tile">' + ICONS.truck + '<span class="t1">Free Delivery</span><span class="t2">Orders over €49</span></div>' +
        '<div class="bb-trust-tile">' + ICONS.ret + '<span class="t1">Free Returns</span><span class="t2">DHL Go-Green</span></div>' +
        '<div class="bb-trust-tile">' + ICONS.crown + '<span class="t1">175+ Years</span><span class="t2">Fine Craftsmanship</span></div></div>';

      return h;
    }

    function renderBuyBox() { box.innerHTML = buyBoxHTML(); }

    function bumpCart() {
      var el = document.querySelector('.cart-count');
      if (el) el.textContent = (parseInt(el.textContent, 10) || 0) + 1;
    }

    box.addEventListener('click', function (e) {
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
        act.classList.add('added'); act.textContent = 'Added ✓';
        setTimeout(function () { act.classList.remove('added'); act.textContent = 'Add to cart'; }, 1400);
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
          (has ? '<span class="tick">✓</span>' : '') + '</b><span>' + r.serves + '</span><span>' + r.use + '</span></div>';
      }).join('');
      return '<h3>Size Guide</h3>' +
        '<p class="pm-note">Frying pan sizes are measured across the top rim — the usable cooking surface is roughly 4&nbsp;cm smaller. When in doubt, size up: food browns better with room around it.</p>' +
        '<div class="sg-table"><div class="sg-row head"><span>Size</span><span>Serves</span><span>Typical use</span></div>' + rows + '</div>' +
        '<p class="pm-note">' + esc(isSet
          ? 'The ' + p.name + ' combines the most-used sizes in one set (' + p.sizes.join(', ') + ').'
          : 'The ' + p.name + ' is available in ' + p.sizes.join(' and ') + ' — ticked above.') + '</p>';
    }

    function clubHTML() {
      var pts = Math.round(p.variants[sel].price);
      return '<h3>myWMF Club Points</h3>' +
        '<p class="pm-note">Collect Club Points with every order — 1 point for every €1 you spend.</p>' +
        '<ul class="care-ul">' +
        '<li>Points are added to your myWMF account as soon as your order ships.</li>' +
        '<li>Redeem them at checkout: 100 points = a €5 reward.</li>' +
        '<li>Members also get early access to seasonal offers and a birthday treat.</li>' +
        '</ul>' +
        '<p class="pm-highlight">You would earn <b>' + pts + ' Club Points</b> with this purchase.</p>' +
        '<button class="gold-pill" data-modal-close>Join myWMF — it’s free</button>';
    }

    /* ---------- marketing example content (Profi Resist family only) ---------- */
    if (isHero) {
      var mk = document.getElementById('pdpMarketing'); if (mk) mk.hidden = false;
      var rc = document.getElementById('pdpRecipes'); if (rc) rc.hidden = false;
    }

    /* ---------- reviews ---------- */
    var list = document.getElementById('reviewsList');
    if (list) {
      if (p.rating != null && p.reviews > 0) {
        var n = Math.min(p.reviews, EXAMPLE_REVIEWS.length);
        list.innerHTML = EXAMPLE_REVIEWS.slice(0, n).map(function (r) {
          return '<article class="review"><span class="stars" style="--pct:100%"></span>' +
            '<div class="review-meta"><span class="review-name">' + esc(r.name) + '</span><span class="review-date">' + r.date + '</span></div>' +
            '<h4>' + esc(r.title) + '</h4><p>' + esc(r.text) + '</p></article>';
        }).join('') +
        (p.reviews > n ? '<div class="reviews-more"><button class="btn-outline">Show more +</button></div>' : '');
      } else {
        list.innerHTML = '<p class="reviews-none">No reviews yet — be the first to review this product.</p>';
      }
    }

    /* ---------- use & care + technical data ---------- */
    var careEl = document.getElementById('careUse');
    if (careEl) careEl.innerHTML = CARE_BY_SURFACE[p.surface] || CARE_BY_SURFACE['Non-stick'];

    function renderTech() {
      var tech = document.getElementById('techTable'); if (!tech) return;
      var rows = [
        ['Series', p.series],
        ['Type', p.type],
        ['Material', p.material],
        ['Surface', p.surface],
        ['Cooking technique', p.technique],
        ['Sizes', p.sizes.map(function (s) { return s + (SIZE_HINTS[s] ? ' (' + SIZE_HINTS[s] + ')' : ''); }).join(', ')],
        ['Article number', p.variants[sel].sku],
        ['Hob compatibility', 'All hobs, including induction'],
        ['Oven-safe', 'Up to 250°C']
      ].filter(function (r) { return r[1]; });
      tech.innerHTML = rows.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('');
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
