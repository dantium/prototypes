import fs from 'fs';

// shop datalayer: SKU -> marketing_subcategory (real material classification)
const subBySku = {};
for (const f of ['dl-pans.json', 'dl-frying-pans.json']) {
  JSON.parse(fs.readFileSync(f, 'utf8')).forEach(d => {
    const ids = String(d.product_id).match(/\d{7,}/g) || [];
    ids.forEach(sku => { if (!subBySku[sku] || d.marketing_subcategory !== 'Default') subBySku[sku] = d.marketing_subcategory || ''; });
  });
}

const MATERIAL_BY_SUB = [
  [/MULTILAYER/,          'Stainless Steel 3-ply'],
  [/STAINLESS CERAMIC/,   'Stainless Steel 1-ply'],
  [/STAINLESS STEEL/,     'Stainless Steel 1-ply'],
  [/SILARGAN/,            'Fusiontec'],
  [/ALU/,                 'Cast Aluminium'],
  [/CAST IRON/,           'Cast Iron'],
];
// fallback when the datalayer row is "Default" (bundles): by series
const MATERIAL_BY_SERIES = [
  [/fusiontec/i,                       'Fusiontec'],
  [/profi resist/i,                    'Stainless Steel 3-ply'],
  [/permadur|devil|ceradur|calabria|talis|messino/i, 'Cast Aluminium'],
];

const catPath = '/Users/dan/Projects/apps/prototypes/wmf/pans/assets/catalog.json';
const cat = JSON.parse(fs.readFileSync(catPath, 'utf8'));
const rows = [];
for (const p of cat.products) {
  const desc = p.description || '';
  const sub = p.variants.map(v => subBySku[v.sku]).find(s => s && s !== 'Default' && !/TABLEWARE/.test(s)) || '';

  // --- Material: shop subcategory first, series fallback ---
  let material = null;
  for (const [re, m] of MATERIAL_BY_SUB) if (re.test(sub)) { material = m; break; }
  if (!material) for (const [re, m] of MATERIAL_BY_SERIES) if (re.test(p.series + ' ' + p.name)) { material = m; break; }

  // --- Surface: subcategory + real description wording ---
  let surface = null;
  if (/CERAMIC/.test(sub) || /ceradur|ceramic\s+(coating|non-stick)/i.test(desc)) surface = 'Ceramic';
  else if (/ALU NS/.test(sub) || /non-stick|nonstick|permadur/i.test(desc)) surface = 'Non-stick';
  else if (material) surface = 'Uncoated';

  // --- Cooking technique: merchandising rule (documented in README) ---
  let technique = null;
  if (/profi resist/i.test(p.series) || material === 'Fusiontec') technique = 'All Purpose';
  else if (surface === 'Uncoated') technique = 'Intense Searing';
  else if (surface) technique = 'Gentle Frying';

  // --- Occasion: merchandising rule ---
  const occasion = ['Everyday'];
  if (p.type === 'Set' || p.minPrice >= 150) occasion.push('Gifting');

  if (material) p.material = material;
  if (surface) p.surface = surface;
  if (technique) p.technique = technique;
  p.occasion = occasion;
  rows.push([p.brand + ' ' + p.name, sub || '(default)', material || '—', surface || '—', technique || '—', occasion.join('+')]);
}
fs.writeFileSync(catPath, JSON.stringify(cat, null, 1));
const W = [40, 26, 22, 10, 16, 18];
console.log(['PRODUCT','SHOP SUBCATEGORY','MATERIAL','SURFACE','TECHNIQUE','OCCASION'].map((h,i)=>h.padEnd(W[i])).join(''));
rows.forEach(r => console.log(r.map((c,i)=>String(c).slice(0,W[i]-1).padEnd(W[i])).join('')));
const miss = rows.filter(r => r[2]==='—').length;
console.log('\nproducts:', rows.length, '| missing material:', miss);
