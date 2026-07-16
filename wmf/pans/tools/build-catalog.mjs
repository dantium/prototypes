import fs from 'fs';
import { parse } from './parse.mjs';

const PAGES = [
  { file: 'pans-48.html',     dl: 'dl-pans.json',        cat: 'pans' },
  { file: 'plp-live-48.html', dl: 'dl-frying-pans.json', cat: 'frying-pans' },
];

// ---- collect SKU-level rows across both pages ----
const rows = {};              // sku -> row
for (const pg of PAGES) {
  const tiles = parse(pg.file).filter(p => p.name && p.image && p.price);
  const dl = JSON.parse(fs.readFileSync(pg.dl, 'utf8'));
  const dlByName = {}; dl.forEach(d => { dlByName[d.product_name] = d; });
  tiles.forEach((t, i) => {
    const d = dlByName[t.name] || dl.find(x => String(x.product_id).includes(t.sku)) || {};
    const r = rows[t.sku] ||= { sku: t.sku, name: t.name, url: t.url, image: t.image,
      price: t.price, msrp: t.msrp || null, label: '', stock: true, cats: {}, brandDl: '' };
    r.cats[pg.cat] = d.position || (i + 1);
    if (d.product_label) r.label = d.product_label;
    if (d.product_stock === 'no' || d.product_availability === 'no') r.stock = false;
    if (d.product_brand) r.brandDl = d.product_brand;
  });
}
const all = Object.values(rows).filter(r => !/roasting/i.test(r.name));
console.log('sku rows:', all.length);

// ---- family grouping (same rules as before) ----
const brandOf = r => r.brandDl === 'Silit' || /^silit/i.test(r.name) ? 'Silit' : 'WMF';
function sizeOf(n){ let m;
  if ((m = n.match(/(\d)\s*[-\s]?piece/i)) || (m = n.match(/(\d)\s*pcs?\b/i))) return 'Set of '+m[1];
  if ((m = n.match(/(\d{2})\s?cm/i))) return m[1]+' cm';
  if (/\bset\b/i.test(n)) return 'Set';
  return 'One size'; }
function baseOf(n){ return n
  .replace(/^(WMF|Silit)\s+/i,'')
  .replace(/,?\s*\d+\s*and\s*\d+\s*cm/ig,'')
  .replace(/\b\d{2}\s?cm\b/ig,'')
  .replace(/,?\s*\d\s*[-\s]?pieces?\b/ig,'')
  .replace(/,?\s*\d\s*pcs?\b/ig,'')
  .replace(/\s*,\s*(,\s*)+/g,', ').replace(/\s{2,}/g,' ').replace(/(^[\s,–-]+)|([\s,–-]+$)/g,'').trim() || n; }
function seriesOf(base){
  const s = base.replace(/\s*(deep\s+)?((fry|grill|serving|stewing)\s*pan|wok|pan)(\s+set)?\b.*$/i,'').replace(/[\s,–-]+$/,'').trim();
  return s || null; }

const fam = {};
for (const r of all) {
  const brand = brandOf(r), base = baseOf(r.name), key = brand + '|' + base;
  (fam[key] ||= { brand, base, variants: [] }).variants.push({
    sku: r.sku, size: sizeOf(r.name), price: r.price, msrp: r.msrp,
    stock: r.stock, label: r.label, cats: r.cats });
}
const rank = s => { const m = s.match(/(\d+)/); const n = m ? +m[1] : 99; return /Set/.test(s) ? 100 + n : n; };
const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };

const products = Object.values(fam).map((f, idx) => {
  const seen = new Set();
  f.variants = f.variants.filter(v => { if (seen.has(v.size)) return false; seen.add(v.size); return true; });
  f.variants.sort((a, b) => rank(a.size) - rank(b.size));
  const def = f.variants.find(v => /28/.test(v.size)) || f.variants[0];
  const cats = {};   // category -> best (lowest) shop position among variants
  f.variants.forEach(v => Object.entries(v.cats).forEach(([c, pos]) => {
    if (!(c in cats) || pos < cats[c]) cats[c] = pos; }));
  const h = hash(f.brand + f.base);
  const series = seriesOf(f.base);
  return {
    id: 'p' + idx, brand: f.brand, name: f.base,
    series: series || f.brand,
    type: f.variants.some(v => /Set/.test(v.size)) ? 'Set' : 'Single pan',
    minPrice: Math.min(...f.variants.map(v => v.price)),
    sizes: f.variants.map(v => v.size),
    rating: +(4.2 + (h % 8) / 10).toFixed(1), reviews: 40 + (h % 860), ratingReal: false,
    default: f.variants.indexOf(def),
    cats,
    variants: f.variants.map(v => ({ sku: v.sku, size: v.size, price: v.price, msrp: v.msrp,
      stock: v.stock, label: v.label || null })),
    search: (f.brand + ' ' + f.base + ' ' + (series || '') + ' ' + f.variants.map(v => v.size).join(' ')).toLowerCase()
  };
});
const catalog = {
  categories: {
    'pans':        { title: 'Pans',        breadcrumb: ['Home','Products','Pans'] },
    'frying-pans': { title: 'Frying Pans', breadcrumb: ['Home','Products','Pans','Frying Pans'] }
  },
  skuCount: all.length, products
};
fs.writeFileSync('/Users/dan/Projects/apps/prototypes/wmf/pans/assets/catalog.json', JSON.stringify(catalog, null, 1));
const inCat = c => products.filter(p => c in p.cats).length;
console.log('families:', products.length, '| pans page:', inCat('pans'), '| frying-pans page:', inCat('frying-pans'));
console.log('labels:', JSON.stringify(products.reduce((m,p)=>{p.variants.forEach(v=>{if(v.label)m[v.label]=(m[v.label]||0)+1});return m;},{})));
console.log('OOS variants:', products.reduce((n,p)=>n+p.variants.filter(v=>!v.stock).length,0));
// image + pdp lists
fs.writeFileSync('imgs2.txt', all.map(r => r.sku + '\t' + r.image + '?optimize=medium&bg-color=255,255,255&fit=bounds&height=600&width=600&canvas=600:600').join('\n'));
fs.writeFileSync('pdps.txt', all.map(r => r.sku + '\t' + r.url).join('\n'));
