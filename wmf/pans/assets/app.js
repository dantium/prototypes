/* ============================================================
   WMF shop prototype — shared runtime
   Pages set `window.PAGE = { kind: 'home' | 'plp', category, ... }`
   before loading this script. The catalog (assets/catalog.json) is
   fetched at runtime, so pages must be served over http.
   ============================================================ */
(function () {
  'use strict';

  var PAGE = window.PAGE || { kind: 'plp', category: 'frying-pans' };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };
  var eur = function (n) { return '€' + n.toFixed(2); };
  var img = function (sku) { return 'assets/products/' + sku + '.jpg'; };

  /* ============================================================
     CHROME — header + megamenu + nav drawer + search overlay + footer
     Rendered from one source so all pages stay in sync.
     ============================================================ */
  var WMF_LOGO = '<svg viewBox="0 0 49.995 61.999" fill="currentColor" aria-hidden="true"><path d="M 43.096 42.17 L 48.3 42.17 L 48.3 46.449 L 43.096 46.449 L 43.096 61.896 L 34.895 61.896 L 34.895 36.121 L 39.696 27.562 L 48.995 27.562 L 48.995 36.121 L 43.196 36.121 L 43.196 42.176 L 43.096 42.17 Z M 9.495 0 L 19.595 18.265 L 27.295 4.274 L 34.996 18.265 L 45.196 0 L 49.995 0 L 32.696 31.209 L 24.995 17.218 L 17.295 31.209 L 0 0 L 9.495 0 Z M 7.296 39.141 L 7.296 61.999 L 3.196 61.999 L 3.196 27.555 L 10.395 27.555 L 17.195 39.871 L 24.995 25.88 L 30.695 36.109 L 30.695 61.896 L 22.496 61.896 L 22.496 39.141 L 14.993 52.815 L 7.293 39.142 L 7.296 39.141 Z"/></svg>';
  var I = {
    menu:   '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"><path d="M4 7h16"/><path d="M4 12h12"/><path d="M4 17h16"/></svg>',
    search: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    heart:  '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21.5l8.8-8.8a5 5 0 0 0 0-7.1Z"/></svg>',
    pin:    '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-5.2 7-11a7 7 0 0 0-14 0c0 5.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>',
    user:   '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M5 20.5a7 7 0 0 1 14 0"/></svg>',
    bag:    '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l1 12.5H5L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>',
    chev:   '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
    x:      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    xs:     '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    searchDark: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>'
  };

  var NAV = ['PANS', 'POTS', 'KITCHEN KNIVES', 'CUTLERY', 'DINING', 'KITCHEN TOOLS', 'COFFEE MACHINES', 'APPLIANCES', 'OFFERS'];

  /* PANS megamenu — columns ported from the WMF megamenu prototype.
     Only pan destinations exist in this prototype, so pan links are live
     and everything else points at the pans category. */
  var MM_PANS =
    '<div class="mm-inner"><div class="mm-grid">' +
      '<div><div class="mm-colhead">PANS <a href="pans.html">View all</a></div>' +
        '<a class="mm-link" href="pans.html">Pan sets</a>' +
        '<a class="mm-link" href="frying-pans.html">Frying pans</a>' +
        '<a class="mm-link" href="pans.html">Grill pans</a>' +
        '<a class="mm-link" href="pans.html">Induction pans</a>' +
        '<a class="mm-link" href="pans.html">Pan lids</a>' +
        '<a class="mm-link" href="pans.html">Pans with lids</a>' +
        '<a class="mm-link" href="pans.html">Stewing pans</a>' +
        '<a class="mm-link" href="pans.html">Serving pans</a>' +
        '<a class="mm-link" href="pans.html">Woks</a>' +
        '<a class="mm-link" href="pans.html">Pan accessories</a></div>' +
      '<div><div class="mm-colhead">COOKING STYLE</div>' +
        '<a class="mm-link" href="frying-pans.html#compare">Intense Searing</a>' +
        '<a class="mm-link" href="frying-pans.html#compare">Gentle Searing</a></div>' +
      '<div><div class="mm-colhead">MATERIAL</div>' +
        '<a class="mm-link" href="pans.html?q=non-stick">Non-stick</a>' +
        '<a class="mm-link" href="pans.html?q=ceradur">Ceramic</a>' +
        '<a class="mm-link" href="pans.html?q=profi resist">Hybrid Honeycomb</a>' +
        '<a class="mm-link" href="pans.html?q=fusiontec">Fusiontec</a>' +
        '<a class="mm-link" href="pans.html?q=profi">Stainless Steel</a></div>' +
      '<div class="mm-col--tile"><div class="mm-tile"><img src="assets/inuse.jpg" alt="">' +
        '<div class="mm-tile-copy"><div class="mm-tile-frame"><span class="l1">MY</span><span class="l2">WMF</span></div>' +
        '<span class="mm-tile-sub">KUNDENCLUB</span></div></div></div>' +
    '</div></div>';

  function renderChrome() {
    var headerMount = document.getElementById('chrome-header');
    if (headerMount) {
      headerMount.innerHTML =
        '<header class="site-header"><div class="wrap"><div class="header-bar">' +
          '<div class="header-left">' +
            '<button class="icon-btn header-hamburger" aria-label="Menu" data-act="nav">' + I.menu + '</button>' +
            '<button class="icon-btn header-search-icon" aria-label="Search" data-act="search">' + I.search + '</button>' +
            '<button class="header-searchbox" aria-label="Search" data-act="search" id="headerSearchbox"></button>' +
          '</div>' +
          '<a class="header-logo" href="index.html" aria-label="WMF home">' + WMF_LOGO + '</a>' +
          '<div class="header-right">' +
            '<button class="icon-btn" aria-label="Wishlist">' + I.heart + '</button>' +
            '<button class="icon-btn" aria-label="Stores">' + I.pin + '</button>' +
            '<button class="icon-btn" aria-label="Account">' + I.user + '</button>' +
            '<button class="icon-btn" aria-label="Basket">' + I.bag + '<span class="cart-count">1</span></button>' +
          '</div>' +
        '</div>' +
        '<div class="header-nav"><nav>' +
          NAV.map(function (n) {
            var active = n === 'PANS' && PAGE.kind !== 'home';
            return '<button class="nav-item' + (active ? ' active' : '') + '" data-nav="' + n + '">' + n + '</button>';
          }).join('') +
        '</nav><div style="display:flex;gap:26px">' +
          '<button class="nav-item nav-item--muted" data-nav="SERVICE">SERVICE</button>' +
          '<button class="nav-item nav-item--muted" data-nav="DISCOVER">DISCOVER</button>' +
        '</div></div></div>' +
        '<div class="mm-panel" id="mmPanel">' + MM_PANS + '</div></header>' +

        '<div class="nav-drawer" id="navDrawer"><div class="nav-drawer-head">Menu' +
          '<button class="icon-btn" style="color:#333" data-act="nav-close">' + I.x + '</button></div>' +
          '<div class="nav-drawer-body">' +
            '<a href="pans.html">PANS ' + I.chev + '</a>' +
            '<a href="frying-pans.html" class="sub">Frying pans ' + I.chev + '</a>' +
            '<a href="pans.html" class="sub">Pan sets ' + I.chev + '</a>' +
            '<a href="pans.html" class="sub">Woks ' + I.chev + '</a>' +
            NAV.slice(1).map(function (n) { return '<a href="index.html">' + n + ' ' + I.chev + '</a>'; }).join('') +
          '</div></div>';
    }

    var searchMount = document.getElementById('chrome-search');
    if (searchMount) {
      searchMount.innerHTML =
        '<div class="search-overlay" id="searchOverlay" aria-hidden="true" role="dialog" aria-label="Search">' +
          '<div class="search-scrim" data-act="search-close"></div>' +
          '<div class="search-panel"><div class="search-bar">' + I.searchDark.replace(/18/g, '22') +
            '<input id="searchInput" type="search" placeholder="Search products, collections and more" autocomplete="off" spellcheck="false">' +
            '<button class="search-close" aria-label="Close search" data-act="search-close">' + I.x + '</button>' +
          '</div><div class="search-body" id="searchBody"></div></div></div>';
    }

    var footerMount = document.getElementById('chrome-footer');
    if (footerMount) {
      footerMount.innerHTML =
        '<footer class="site-footer"><div class="wrap"><div class="footer-top">' +
          '<div class="footer-col"><h4>Our Brands</h4><a href="#">Silit</a><a href="#">Kaiser</a></div>' +
          '<div class="footer-col"><h4>Our Services</h4><a href="#">Payment methods</a><a href="#">Shipping and delivery</a><a href="#">Cancellation policy</a></div>' +
          '<div class="footer-col"><h4>Help &amp; Contact</h4><a href="#">FAQ</a><a href="#">Contact</a><a href="#">Online live consultation</a></div>' +
          '<div class="footer-col"><h4>About Us</h4><a href="#">WMF brand</a><a href="#">Story</a><a href="#">Career</a></div>' +
          '<div class="socials">' +
            '<a class="social" href="#" aria-label="YouTube"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.5A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.5a2.5 2.5 0 0 0 1.8-1.8C23 15.2 23 12 23 12Zm-13 3V9l5.2 3-5.2 3Z"/></svg></a>' +
            '<a class="social" href="#" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg></a>' +
            '<a class="social" href="#" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9V7c0-.9.6-1 1-1h2V2.5h-3C11.2 2.5 10 4.2 10 6.4V9H7.5v3.6H10V22h4v-9.4h2.6l.4-3.6H14Z"/></svg></a>' +
            '<a class="social" href="#" aria-label="Pinterest"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 .0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.9-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.5-.2 1 .5 1.9 1.6 1.9 1.9 0 3.2-2.4 3.2-5.3 0-2.2-1.5-3.8-4.1-3.8a4.7 4.7 0 0 0-4.9 4.7c0 .9.3 1.5.7 2 .2.2.2.3.1.5l-.2.9c-.1.3-.3.4-.6.2-1.2-.5-1.8-1.9-1.8-3.5 0-2.6 2.2-5.7 6.5-5.7 3.5 0 5.8 2.5 5.8 5.2 0 3.6-2 6.2-4.9 6.2-1 0-1.9-.5-2.2-1.1l-.6 2.4c-.2.8-.7 1.7-1.1 2.3A10 10 0 1 0 12 2Z"/></svg></a>' +
            '<a class="social" href="#" aria-label="WhatsApp"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a9.9 9.9 0 0 0-8.5 15l-1.1 4 4.1-1.1A10 10 0 1 0 12 2Zm5.8 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.8-.6-3-1.3-5-4.4-5.2-4.6-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.1.1.6-.1 1.2Z"/></svg></a>' +
          '</div></div>' +
          '<div class="footer-bottom"><span class="fb-logo">' + WMF_LOGO + '</span>' +
            '<nav><a href="#">Data protection</a><a href="#">Terms and Conditions</a><a href="#">Imprint</a></nav>' +
            '<span class="footer-copy">© 2026 WMF – All rights reserved</span>' +
          '</div></div></footer>';
    }
  }

  /* ---- megamenu + drawers behaviour ---- */
  function bindChrome() {
    var mmPanel = document.getElementById('mmPanel');
    var mmOpen = false;
    function setMenu(open) {
      mmOpen = open;
      if (mmPanel) mmPanel.classList.toggle('open', open);
    }
    document.addEventListener('click', function (e) {
      // the ×-to-clear sits inside the header search box (which itself opens search)
      if (e.target.closest('[data-hs-clear]') || e.target.closest('[data-sh-clear]')) {
        setSearch('');
        updateHeaderSearch();
        return;
      }
      var act = e.target.closest('[data-act]');
      if (act) {
        var a = act.getAttribute('data-act');
        if (a === 'search') { openSearch(); return; }
        if (a === 'search-close') { closeSearch(); return; }
        if (a === 'nav') { document.body.classList.add('nav-open'); return; }
        if (a === 'nav-close') { document.body.classList.remove('nav-open'); return; }
      }
      var nav = e.target.closest('.nav-item');
      if (nav) {
        // click = navigate (hover already opens the panel); PANS is the only live category
        if (nav.getAttribute('data-nav') === 'PANS') { location.href = 'pans.html'; return; }
        setMenu(false);
        return;
      }
      if (mmOpen && !e.target.closest('.mm-panel')) setMenu(false);
      if (document.body.classList.contains('nav-open') &&
          !e.target.closest('.nav-drawer') && !e.target.closest('[data-act="nav"]')) {
        document.body.classList.remove('nav-open');
      }
    });
    document.addEventListener('mouseover', function (e) {
      var nav = e.target.closest('.nav-item');
      if (nav) setMenu(nav.getAttribute('data-nav') === 'PANS');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setMenu(false); closeSearch(); document.body.classList.remove('nav-open', 'filters-open'); }
    });
  }

  /* ============================================================
     CATALOG
     ============================================================ */
  var DATA = { products: [] };      // full catalog (all categories) — search uses this
  var LIST = [];                    // products for this page's category

  function variantOf(p) { return p.variants[p._sel == null ? p.default : p._sel] || p.variants[0]; }
  function isBestseller(p) { return p.variants.some(function (v) { return /BESTSELLER/i.test(v.label || ''); }); }
  function isNew(p) { return p.variants.some(function (v) { return /NEW/i.test(v.label || ''); }); }
  function onSaleP(p) { return p.variants.some(function (v) { return v.msrp && v.msrp > v.price; }); }

  /* ============================================================
     PRODUCT GRID
     ============================================================ */
  var grid = document.getElementById('grid');
  var productCountEl = document.getElementById('productCount');
  var showMoreRow = document.getElementById('showMoreRow');
  var showMoreBtn = document.getElementById('showMoreBtn');
  var PAGE_SIZE = 12, shown = PAGE_SIZE, searchQ = '';

  var BAG_S = '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#1c1c1c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l1 12.5H5L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>';
  var HEART_S = '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#1c1c1c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21.5l8.8-8.8a5 5 0 0 0 0-7.1Z"/></svg>';
  var PROMO = '<article class="promo-tile"><img src="assets/promo-bg.png" alt=""><div class="promo-copy"><h3>Choose the right pan for the job</h3></div><a class="btn-outline" href="frying-pans.html#compare" style="border-color:#fff;color:#fff;background:transparent;margin-top:22px">Compare range</a></article>';

  /* corner badge = the shop's real product label for the selected variant */
  function badgeFor(v) {
    var label = (v.label || '').split(',')[0].trim();
    if (!label) return '';
    var cls = label === 'SALE' ? ' badge--sale' : label === 'NEW' ? ' badge--new' : '';
    var text = label.charAt(0) + label.slice(1).toLowerCase();
    return '<span class="badge' + cls + '">' + esc(text) + '</span>';
  }

  /* info labels: real/derived today (sets), PIM attributes when the data lands */
  function infoLabels(p, v) {
    var out = [];
    if (/^Set of \d/.test(v.size)) out.push(v.size);
    ['technique', 'surface'].forEach(function (key) {
      var val = p[key];
      if (!val) return;
      (Array.isArray(val) ? val : [val]).slice(0, 2 - out.length).forEach(function (x) { out.push(x); });
    });
    return out.slice(0, 2).map(function (t) { return '<span class="label">' + esc(t) + '</span>'; }).join('');
  }

  function cardHTML(p) {
    var v = variantOf(p);
    var onSale = v.msrp && v.msrp > v.price;
    var save = onSale ? Math.round((1 - v.price / v.msrp) * 100) : 0;
    var swatches = p.variants.map(function (vv, i) {
      var sel = i === (p._sel == null ? p.default : p._sel);
      return '<span class="swatch' + (sel ? ' sel' : '') + (vv.stock ? '' : ' oos') + '" data-i="' + i + '"' +
        (vv.stock ? '' : ' title="Out of stock"') + '>' + esc(vv.size) + '</span>';
    }).join('');
    var labels = infoLabels(p, v);
    return '<article class="card" data-id="' + p.id + '">' +
      '<div class="card-media">' +
        '<img class="pan-inuse" src="assets/inuse.jpg" alt="" aria-hidden="true">' +
        badgeFor(v) +
        '<div class="card-actions"><button class="round" aria-label="Add to basket">' + BAG_S + '</button>' +
        '<button class="round" aria-label="Add to wishlist">' + HEART_S + '</button></div>' +
        '<img class="pan" src="' + img(v.sku) + '" alt="' + esc(p.brand + ' ' + p.name) + '" loading="lazy">' +
        (labels ? '<div class="card-labels">' + labels + '</div>' : '') +
      '</div>' +
      '<div class="card-body">' +
        '<span class="card-eyebrow">' + esc(p.series || p.brand) + '</span>' +
        '<h3 class="card-name">' + esc(p.name) + '</h3>' +
        /* real Bazaarvoice ratings from the PDPs; products without reviews show none */
        (p.rating != null
          ? '<div class="card-rating"><span class="stars" style="--pct:' + Math.round(p.rating / 5 * 100) + '%"></span>' +
            '<span class="rating-count">' + p.rating.toFixed(1) + ' (' + p.reviews + ')</span></div>'
          : '') +
        '<div class="card-price"><span class="price' + (onSale ? ' sale' : '') + '">' + eur(v.price) + '</span>' +
        (onSale ? '<span class="msrp">MSRP ' + eur(v.msrp) + '</span><span class="discount">Save ' + save + '%</span>' : '') + '</div>' +
        '<div class="stock' + (v.stock ? '' : ' out') + '"><span class="dot"></span>' + (v.stock ? 'In stock' : 'Out of stock') + '</div>' +
        '<div class="card-sizes"><span class="lbl">Size:</span>' + swatches + '</div>' +
      '</div></article>';
  }

  /* Name/series matches rank above matches found only in the (real) product
     description — both tiers keep their existing order. */
  function matchProducts(q, pool) {
    var toks = q.toLowerCase().split(/\s+/).filter(Boolean);
    var src = pool || DATA.products;
    if (!toks.length) return src.slice();
    var inHay = function (p, t) { return p.search.indexOf(t) >= 0; };
    var inDesc = function (p, t) { return inHay(p, t) || (p._desc && p._desc.indexOf(t) >= 0); };
    var byName = [], byDesc = [];
    src.forEach(function (p) {
      if (toks.every(function (t) { return inHay(p, t); })) byName.push(p);
      else if (toks.every(function (t) { return inDesc(p, t); })) byDesc.push(p);
    });
    return byName.concat(byDesc);
  }

  /* short snippet of the description around the first matched token */
  function descSnippet(p, q) {
    if (!p.description || !p._desc) return null;
    var toks = q.toLowerCase().split(/\s+/).filter(Boolean);
    var t = null, pos = -1;
    for (var i = 0; i < toks.length; i++) {
      var at = p._desc.indexOf(toks[i]);
      if (at >= 0 && (pos < 0 || at < pos)) { pos = at; t = toks[i]; }
    }
    if (pos < 0) return null;
    var start = Math.max(0, pos - 34);
    var end = Math.min(p.description.length, pos + t.length + 44);
    var frag = p.description.slice(start, end).replace(/^\S*\s/, '').replace(/\s\S*$/, '');
    return (start > 0 ? '…' : '') + hi(frag, t) + (end < p.description.length ? '…' : '');
  }

  function currentList() {
    var list = searchQ ? matchProducts(searchQ, LIST) : LIST;
    return list.filter(passFacets);
  }

  /* popular category tiles for the no-results state (real pages, real photos) */
  var NR_CATS = [
    { label: 'Pans',        href: 'pans.html',                                        sku: '3201113557' },
    { label: 'Frying Pans', href: 'frying-pans.html',                                 sku: '3201000358' },
    { label: 'Pan Sets',    href: 'pans.html?q=' + encodeURIComponent('fry pan set'), sku: '3201000530' },
    { label: 'Woks',        href: 'pans.html?q=wok',                                  sku: '3201001442' }
  ];

  function noResultsHTML() {
    if (!searchQ) return '<div class="no-results">No pans match the selected filters. Try removing one.</div>';
    return '<div class="no-results">' +
      '<div class="nr-ico"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg></div>' +
      '<p class="nr-title">No results for “' + esc(searchQ) + '”</p>' +
      '<p class="nr-copy">Check your spelling or try a more general term. Here are some popular searches.</p>' +
      '<div class="search-chips">' + TRENDING.slice(0, 4).map(chipHTML).join('') + '</div>' +
      '<p class="search-section-title">Popular categories</p>' +
      '<div class="nr-cats">' + NR_CATS.map(function (c) {
        return '<a class="subcat" href="' + c.href + '"><span class="subcat-thumb"><img src="' + img(c.sku) + '" alt=""></span>' +
          '<span class="subcat-label">' + esc(c.label) + '</span></a>';
      }).join('') + '</div></div>';
  }

  /* the results head replaces the category page head while searching */
  function updateSearchHead(count) {
    var el = document.getElementById('searchHead'); if (!el) return;
    if (!searchQ) { el.innerHTML = ''; return; }
    el.innerHTML = '<div class="search-head">' +
      '<p class="sh-eyebrow">Search results</p>' +
      '<h1>' + count + ' result' + (count === 1 ? '' : 's') + ' for <b>“' + esc(searchQ) + '”</b></h1>' +
      '<div class="sh-actions"><button class="sh-clear" data-sh-clear>Clear search</button></div></div>';
  }

  function renderGrid() {
    if (!grid) return;
    var list = currentList();
    var cards = list.slice(0, shown).map(cardHTML);
    if (!searchQ && cards.length >= 2 && PAGE.promo !== false) cards.splice(2, 0, PROMO);
    grid.innerHTML = cards.length ? cards.join('') : noResultsHTML();
    // zero results: strip the page down to the message and its escape routes
    document.body.classList.toggle('searching-empty', !!searchQ && list.length === 0);
    updateSearchHead(list.length);
    if (showMoreRow) showMoreRow.style.display = list.length > shown ? '' : 'none';
    if (productCountEl) {
      // while searching, the results head above carries the count
      productCountEl.textContent = searchQ ? '' : list.length + ' Product' + (list.length === 1 ? '' : 's');
    }
    var applyBtn = document.getElementById('drawerApplyBtn');
    if (applyBtn) applyBtn.textContent = 'Show ' + list.length + ' product' + (list.length === 1 ? '' : 's');
  }

  if (grid) {
    grid.addEventListener('click', function (e) {
      var chip = e.target.closest('.search-chip[data-q]');
      if (chip) { submitSearch(chip.getAttribute('data-q')); return; }
      var sw = e.target.closest('.swatch'); if (!sw) return;
      var card = sw.closest('.card');
      var p = DATA.products.find(function (x) { return x.id === card.getAttribute('data-id'); });
      if (!p) return;
      p._sel = parseInt(sw.dataset.i, 10);
      card.outerHTML = cardHTML(p);
    });
  }
  if (showMoreBtn) showMoreBtn.addEventListener('click', function () { shown += PAGE_SIZE; renderGrid(); });

  function setSearch(q, skipScroll) {
    searchQ = (q || '').trim(); shown = PAGE_SIZE;
    var url = new URL(location.href);
    if (searchQ) url.searchParams.set('q', searchQ); else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    document.body.classList.toggle('searching', !!searchQ);   // category content only in category mode
    renderGrid();
    updateHeaderSearch();
    if (!skipScroll) window.scrollTo({ top: 0, behavior: searchQ ? 'auto' : 'smooth' });
  }

  /* ============================================================
     SEARCH OVERLAY  (UX ported from the search prototype;
     completions, categories and products all come from the catalog)
     ============================================================ */
  var TRENDING = ['Profi Resist fry pan', 'Fusiontec', 'Non-stick fry pan', 'Fry pan set', 'Devil', 'Wok'];
  var recent = [];
  try { recent = JSON.parse(sessionStorage.getItem('wmf_recent') || '[]'); } catch (e) {}
  function saveRecent() { try { sessionStorage.setItem('wmf_recent', JSON.stringify(recent)); } catch (e) {} }

  var ICO = {
    clock:  '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    trend:  '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17 9 11l4 4 8-8"/><path d="M17 7h4v4"/></svg>',
    insert: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M17 17 7 7"/><path d="M7 13V7h6"/></svg>',
    grid:   '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    chev:   '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
    search: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    arrow:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>'
  };

  /* search aids derived from the real catalog after it loads */
  var VOCAB = [];        // query completions (real product vocabulary)
  var SEARCH_CATS = [];  // category suggestions with real counts

  function buildSearchAids() {
    var set = {};
    var add = function (s) { s = String(s || '').toLowerCase().trim(); if (s.length > 2) set[s] = 1; };
    DATA.products.forEach(function (p) {
      p._desc = (p.description || '').toLowerCase();   // searchable copy of the real PDP description
      add(p.series);
      add(p.brand + ' ' + p.series);
      var m = p.name.toLowerCase().match(/(deep fry pan|fry pan set|fry pan|frypan|grill pan|serving pan|roasting pan|wok)/);
      if (m) { add(m[1]); add(p.series + ' ' + m[1]); }
    });
    VOCAB = Object.keys(set).sort();
    var count = function (c) { return DATA.products.filter(function (p) { return p.cats && (c in p.cats); }).length; };
    SEARCH_CATS = [
      { label: 'Pans',        href: 'pans.html',        count: count('pans'),        keys: 'pans pan cookware pot' },
      { label: 'Frying Pans', href: 'frying-pans.html', count: count('frying-pans'), keys: 'frying pans fry pan frypan' }
    ];
  }

  function openSearch() {
    var o = document.getElementById('searchOverlay'); if (!o) return;
    o.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
    var i = document.getElementById('searchInput');
    if (i) i.value = searchQ;
    renderSuggest(searchQ);
    setTimeout(function () { if (i) { i.focus(); i.select(); } }, 40);
  }
  function closeSearch() {
    var o = document.getElementById('searchOverlay'); if (!o) return;
    o.setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
  }
  window.openSearch = openSearch; window.closeSearch = closeSearch;

  /* bold the part of `text` that matches `q` (all parts escaped) */
  function hi(text, q) {
    var i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0 || !q) return esc(text);
    return esc(text.slice(0, i)) + '<b>' + esc(text.slice(i, i + q.length)) + '</b>' + esc(text.slice(i + q.length));
  }

  function recentRow(r) {
    return '<div class="s-row" data-q="' + esc(r) + '"><span class="s-ico">' + ICO.clock + '</span>' +
      '<span class="s-label">' + esc(r) + '</span>' +
      '<button class="s-remove" data-remove="' + esc(r) + '" aria-label="Remove ' + esc(r) + '">' + I.xs + '</button></div>';
  }
  function trendRow(t) {
    return '<div class="s-row" data-q="' + esc(t) + '"><span class="s-ico">' + ICO.trend + '</span>' +
      '<span class="s-label">' + esc(t) + '</span></div>';
  }
  function completionRow(c, q) {
    return '<div class="s-row" data-q="' + esc(c) + '"><span class="s-ico">' + ICO.search + '</span>' +
      '<span class="s-label">' + hi(c, q) + '</span><span class="s-end">' + ICO.insert + '</span></div>';
  }
  function catRow(c, q) {
    return '<a class="s-row" href="' + c.href + '"><span class="s-ico">' + ICO.grid + '</span>' +
      '<span class="s-label">' + hi(c.label, q) + '<span class="s-sub">Category · ' + c.count + ' products</span></span>' +
      '<span class="s-end">' + ICO.chev + '</span></a>';
  }
  function productRow(p, q) {
    var v = p.variants[p.default] || p.variants[0];
    var from = Math.min.apply(null, p.variants.map(function (x) { return x.price; }));
    var meta = esc(p.variants.length > 1 ? p.variants.length + ' sizes · from ' + eur(from) : v.size);
    // when the hit came from the description, show the matched text instead
    if (q) {
      var toks = q.toLowerCase().split(/\s+/).filter(Boolean);
      var nameHit = toks.every(function (t) { return p.search.indexOf(t) >= 0; });
      if (!nameHit) { var snip = descSnippet(p, q); if (snip) meta = snip; }
    }
    return '<div class="s-row" data-q="' + esc(p.brand + ' ' + p.name) + '">' +
      '<img class="s-thumb" src="' + img(v.sku) + '" alt="">' +
      '<span class="s-label">' + esc(p.brand + ' ' + p.name) + '<span class="s-sub">' + meta + '</span></span>' +
      '<span class="s-price">' + eur(v.price) + '</span></div>';
  }
  function chipHTML(t) { return '<button class="search-chip" data-q="' + esc(t) + '">' + esc(t) + '</button>'; }

  /* popular categories on the empty state — real destinations only */
  var POPULAR_CATS = [
    { label: 'Pans', href: 'pans.html' },
    { label: 'Frying Pans', href: 'frying-pans.html' },
    { label: 'Pan Sets', href: 'pans.html?q=' + encodeURIComponent('fry pan set') },
    { label: 'Woks', href: 'pans.html?q=wok' },
    { label: 'Fusiontec', href: 'pans.html?q=fusiontec' }
  ];

  function renderSuggest(q) {
    var body = document.getElementById('searchBody'); if (!body) return;
    q = (q || '').trim();
    if (!q) {
      var html = '';
      if (recent.length) {
        html += '<div class="search-section-head"><p class="search-section-title">Recent searches</p>' +
          '<button class="search-clear-recents" data-clear-recents>Clear all</button></div>' +
          recent.map(recentRow).join('');
      }
      html += '<div class="search-section-head"><p class="search-section-title">Trending searches</p></div>' +
        TRENDING.map(trendRow).join('') +
        '<div class="search-section-head"><p class="search-section-title">Popular categories</p></div>' +
        '<div class="search-chips">' + POPULAR_CATS.map(function (c) {
          return '<a class="search-chip" href="' + c.href + '">' + esc(c.label) + '</a>';
        }).join('') + '</div>';
      body.innerHTML = html;
      return;
    }
    var ql = q.toLowerCase();
    var completions = VOCAB.filter(function (v) { return v.indexOf(ql) >= 0 && v !== ql; }).slice(0, 4);
    var cats = SEARCH_CATS.filter(function (c) { return (c.label + ' ' + c.keys).toLowerCase().indexOf(ql) >= 0; }).slice(0, 2);
    var hits = matchProducts(q).slice(0, 4);
    var html = completions.map(function (c) { return completionRow(c, q); }).join('');
    if (cats.length)  html += (html ? '<div class="s-divider"></div>' : '') + cats.map(function (c) { return catRow(c, q); }).join('');
    if (hits.length)  html += (html ? '<div class="s-divider"></div>' : '') + hits.map(function (p) { return productRow(p, q); }).join('');
    if (!html) html = '<div class="search-empty-note">No suggestions — press Enter to search.</div>';
    html += '<button class="search-cta" data-q="' + esc(q) + '">See all results for “' + esc(q) + '” ' + ICO.arrow + '</button>';
    body.innerHTML = html;
  }

  /* header search box mirrors the active query (search prototype pattern) */
  function updateHeaderSearch() {
    var box = document.getElementById('headerSearchbox'); if (!box) return;
    if (searchQ) {
      box.innerHTML = I.search + '<span class="hs-query">' + esc(searchQ) + '</span>' +
        '<span class="hs-clear" data-hs-clear role="button" aria-label="Clear search">' + I.xs + '</span>';
    } else {
      box.innerHTML = I.search + '<span class="hs-placeholder">Search</span>';
    }
  }

  function submitSearch(q) {
    q = (q || '').trim(); if (!q) return;
    recent = [q].concat(recent.filter(function (r) { return r.toLowerCase() !== q.toLowerCase(); })).slice(0, 6);
    saveRecent();
    closeSearch();
    if (PAGE.kind === 'home') { location.href = 'pans.html?q=' + encodeURIComponent(q); return; }
    var input = document.getElementById('searchInput'); if (input) input.value = q;
    setSearch(q);
    updateHeaderSearch();
  }

  function bindSearch() {
    var input = document.getElementById('searchInput');
    var body = document.getElementById('searchBody');
    if (!input) return;
    input.addEventListener('input', function () { renderSuggest(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') submitSearch(input.value);
      else if (e.key === 'Escape') closeSearch();
    });
    body.addEventListener('click', function (e) {
      var rm = e.target.closest('[data-remove]');
      if (rm) {
        var label = rm.getAttribute('data-remove');
        recent = recent.filter(function (r) { return r !== label; });
        saveRecent(); renderSuggest(input.value);
        return;
      }
      if (e.target.closest('[data-clear-recents]')) {
        recent = []; saveRecent(); renderSuggest(input.value);
        return;
      }
      if (e.target.closest('a.s-row') || e.target.closest('a.search-chip')) return;  // real links navigate
      var el = e.target.closest('[data-q]'); if (!el) return;
      submitSearch(el.getAttribute('data-q'));
    });
  }

  /* ============================================================
     FACETS  (generated from the catalog; PIM groups dormant)
     ============================================================ */
  var afEl = document.getElementById('activeFilters');
  var afMobileEl = document.getElementById('activeFiltersMobile');
  var facetsEl = document.getElementById('facets');
  var FACETS = [];
  var selected = {};

  var PIM_FACETS = [
    { key: 'material',  title: 'Material',          open: true  },
    { key: 'technique', title: 'Cooking Technique', open: true  },
    { key: 'surface',   title: 'Surface',           open: false },
    { key: 'occasion',  title: 'Occasion',          open: false }
  ];

  /* option ordering from the Figma rail (alphabetical otherwise) */
  var OPTION_ORDER = {
    material:  ['Stainless Steel 3-ply', 'Stainless Steel 1-ply', 'Fusiontec', 'Cast Aluminium', 'Cast Iron'],
    technique: ['Intense Searing', 'Gentle Frying', 'All Purpose'],
    surface:   ['Non-stick', 'Ceramic', 'Uncoated'],
    occasion:  ['Everyday', 'Gifting']
  };
  /* serving-size hints shown beside sizes (Figma) */
  var SIZE_HINTS = { '20 cm': '(1 – 2 people)', '24 cm': '(2 – 4 people)', '28 cm': '(4 – 6 people)' };

  function buildFacets() {
    var uniq = function (a) { return Array.from(new Set(a)); };
    var rank = function (s) { var m = s.match(/(\d+)/); var n = m ? +m[1] : 99; return /Set/.test(s) ? 100 + n : n; };
    var valuesOf = function (p, key) {
      var v = p[key];
      if (v === undefined || v === null || v === '') return [];
      return Array.isArray(v) ? v : [v];
    };
    var orderSort = function (key) {
      var pref = OPTION_ORDER[key] || [];
      return function (a, b) {
        var ia = pref.indexOf(a), ib = pref.indexOf(b);
        if (ia < 0 && ib < 0) return a < b ? -1 : 1;
        if (ia < 0) return 1; if (ib < 0) return -1;
        return ia - ib;
      };
    };
    var attrGroup = function (def) {
      var vals = uniq(LIST.reduce(function (a, p) { return a.concat(valuesOf(p, def.key)); }, [])).sort(orderSort(def.key));
      if (!vals.length) return null;
      return { key: def.key, title: def.title, open: def.open, options: vals.map(function (v) {
        return { label: v, test: function (p) { return valuesOf(p, def.key).indexOf(v) >= 0; } }; }) };
    };
    var pim = {};
    PIM_FACETS.forEach(function (d) { pim[d.key] = attrGroup(d); });

    var sizes = uniq(LIST.reduce(function (a, p) { return a.concat(p.sizes); }, []))
                  .sort(function (a, b) { return rank(a) - rank(b); });
    var series = uniq(LIST.map(function (p) { return p.series; })).sort();

    /* group order and expanded states follow the Figma rail:
       Material / Size / Cooking Technique open; the rest collapsed */
    FACETS = [
      pim.material,
      { key: 'size', title: 'Size', open: true, options: sizes.map(function (s) {
        return { label: s, hint: SIZE_HINTS[s], test: function (p) { return p.sizes.indexOf(s) >= 0; } }; }) },
      pim.technique,
      { key: 'price', title: 'Price', open: false, options: [
        { label: 'Under €50',   test: function (p) { return p.minPrice < 50; } },
        { label: '€50 – €100',  test: function (p) { return p.minPrice >= 50 && p.minPrice < 100; } },
        { label: '€100 – €150', test: function (p) { return p.minPrice >= 100 && p.minPrice < 150; } },
        { label: 'Over €150',   test: function (p) { return p.minPrice >= 150; } } ] },
      { key: 'series', title: 'Series', open: false, options: series.map(function (s) {
        return { label: s, test: function (p) { return p.series === s; } }; }) },
      { key: 'availability', title: 'Availability', open: false, options: [
        { label: 'In stock',     test: function (p) { return p.variants.some(function (v) { return v.stock; }); } },
        { label: 'Out of stock', test: function (p) { return p.variants.some(function (v) { return !v.stock; }); } } ] },
      pim.surface,
      pim.occasion
    ].filter(Boolean);
    FACETS.forEach(function (g) { selected[g.key] = selected[g.key] || []; });
  }

  function renderFacets() {
    if (!facetsEl) return;
    facetsEl.innerHTML = FACETS.map(function (g) {
      return '<div class="filter-group' + (g.open ? ' open' : '') + '">' +
        '<button class="filter-head">' + esc(g.title) + ' <span class="filter-toggle"></span></button>' +
        '<div class="filter-body">' + g.options.map(function (o) {
          var on = selected[g.key].indexOf(o.label) >= 0;
          return '<label class="facet"><input type="checkbox" data-key="' + g.key + '" value="' + esc(o.label) + '"' +
            (on ? ' checked' : '') + '><span class="box"></span><span class="facet-label">' + esc(o.label) +
            (o.hint ? ' <span class="facet-hint">' + esc(o.hint) + '</span>' : '') + '</span></label>';
        }).join('') + '</div></div>';
    }).join('');
  }

  function passFacets(p) {
    return FACETS.every(function (g) {
      var chosen = selected[g.key];
      if (!chosen || !chosen.length) return true;
      return g.options.some(function (o) { return chosen.indexOf(o.label) >= 0 && o.test(p); });
    });
  }

  function chipsHTML() {
    var chips = [];
    FACETS.forEach(function (g) {
      selected[g.key].forEach(function (label) {
        chips.push('<span class="chip">' + esc(label) +
          '<button aria-label="Remove ' + esc(label) + '" data-key="' + g.key + '" data-label="' + esc(label) + '">' + I.xs + '</button></span>');
      });
    });
    return chips;
  }

  function renderChips() {
    var chips = chipsHTML();
    [afEl, afMobileEl].forEach(function (el) {
      if (!el) return;
      if (!chips.length) { el.hidden = true; el.innerHTML = ''; return; }
      el.hidden = false;
      var head = el === afEl
        ? '<div class="af-head"><span class="af-title">Active filters</span><button class="af-clear" data-af-clear>Clear all</button></div>'
        : '';
      el.innerHTML = head + chips.join('');
    });
  }

  function applyFilters() { shown = PAGE_SIZE; renderChips(); renderGrid(); }

  function bindFacets() {
    if (facetsEl) {
      facetsEl.addEventListener('change', function (e) {
        var cb = e.target.closest('input[type="checkbox"]'); if (!cb) return;
        var arr = selected[cb.dataset.key]; if (!arr) return;
        var i = arr.indexOf(cb.value);
        if (cb.checked && i < 0) arr.push(cb.value);
        else if (!cb.checked && i >= 0) arr.splice(i, 1);
        applyFilters();
      });
    }
    [afEl, afMobileEl].forEach(function (el) {
      if (!el) return;
      el.addEventListener('click', function (e) {
        var btn = e.target.closest('button'); if (!btn) return;
        if (btn.hasAttribute('data-af-clear')) {
          Object.keys(selected).forEach(function (k) { selected[k] = []; });
          renderFacets(); applyFilters(); return;
        }
        var arr = selected[btn.dataset.key]; if (!arr) return;
        var i = arr.indexOf(btn.dataset.label);
        if (i >= 0) arr.splice(i, 1);
        renderFacets(); applyFilters();
      });
    });
  }

  /* ---- filter drawer (mobile) / rail collapse (desktop) ---- */
  window.onFilterBtn = function () {
    if (window.matchMedia('(max-width: 900px)').matches) document.body.classList.add('filters-open');
    else document.body.classList.toggle('rail-collapsed');
  };
  window.closeFilterDrawer = function () { document.body.classList.remove('filters-open'); };

  /* ============================================================
     SORT — "Recommended" is the shop's own category ordering
     ============================================================ */
  function priceOf(p) { return variantOf(p).price; }
  function posOf(p) { return (p.cats && p.cats[PAGE.category]) || 999; }
  function sortProducts(mode) {
    if (mode === 'Price: low to high') LIST.sort(function (x, y) { return priceOf(x) - priceOf(y); });
    else if (mode === 'Price: high to low') LIST.sort(function (x, y) { return priceOf(y) - priceOf(x); });
    else if (mode === 'Top rated') LIST.sort(function (x, y) { return ((y.rating || 0) - (x.rating || 0)) || ((y.reviews || 0) - (x.reviews || 0)) || (posOf(x) - posOf(y)); });
    else if (mode === 'New in') LIST.sort(function (x, y) { return (isNew(y) - isNew(x)) || (posOf(x) - posOf(y)); });
    else LIST.sort(function (x, y) { return posOf(x) - posOf(y); });
    shown = PAGE_SIZE; renderGrid();
  }

  /* ============================================================
     BOOT
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    renderChrome();
    updateHeaderSearch();
    bindChrome();
    bindSearch();
    bindFacets();

    // FAQ accordions (frying-pans page only)
    document.querySelectorAll('.faq-q').forEach(function (b) {
      b.addEventListener('click', function () { b.closest('.faq-item').classList.toggle('open'); });
    });
    // filter group open/close (delegated — groups render from the catalog)
    document.addEventListener('click', function (e) {
      var fh = e.target.closest('.filter-head');
      if (fh) fh.closest('.filter-group').classList.toggle('open');
    });
    // close filter drawer on scrim tap
    document.addEventListener('click', function (e) {
      if (document.body.classList.contains('filters-open') &&
          !e.target.closest('.filters') && !e.target.closest('.filter-open-btn')) {
        document.body.classList.remove('filters-open');
      }
    });

    fetch('assets/catalog.json')
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) {
        DATA = d;
        buildSearchAids();
        if (PAGE.kind === 'home') return;
        LIST = DATA.products.filter(function (p) { return p.cats && (PAGE.category in p.cats); });
        buildFacets();
        renderFacets();
        var q = new URLSearchParams(location.search).get('q');
        if (q) {
          searchQ = q.trim();
          var input = document.getElementById('searchInput'); if (input) input.value = searchQ;
        }
        document.body.classList.toggle('searching', !!searchQ);
        updateHeaderSearch();
        var sortSelect = document.getElementById('sortSelect');
        if (sortSelect) sortSelect.addEventListener('change', function () { sortProducts(sortSelect.value); });
        sortProducts('Recommended');
      })
      .catch(function (err) {
        console.error('Could not load assets/catalog.json:', err);
        if (grid) {
          grid.innerHTML = '<p class="no-results"><strong>Couldn’t load assets/catalog.json</strong><br>' +
            'This page reads its catalog over http. Serve the folder — e.g. <code>python3 -m http.server</code> — ' +
            'and reload. Opening the page directly from disk won’t work.</p>';
        }
        if (productCountEl) productCountEl.textContent = '';
        if (showMoreRow) showMoreRow.style.display = 'none';
      });
  });
})();
