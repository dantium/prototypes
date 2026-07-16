import fs from 'fs';
const dec=s=>s.replace(/&#x([0-9a-fA-F]+);/g,(_,x)=>String.fromCodePoint(parseInt(x,16))).replace(/&#(\d+);/g,(_,d)=>String.fromCodePoint(+d)).replace(/&amp;/g,'&').replace(/&quot;/g,'"');
export function parse(file){
  const h=fs.readFileSync(file,'utf8');
  const decoded=dec(h);
  // all product anchors -> map sku -> best name, first idx
  const bySku={};
  const aRe=/<a\b([^>]*)>([\s\S]*?)<\/a>/g; let m;
  while((m=aRe.exec(h))){ const attrs=dec(m[1]); if(!/product-item-link/.test(attrs))continue;
    const hm=attrs.match(/href="([^"]+?-(\d{6,})\.html)"/); if(!hm)continue;
    const sku=hm[2]; const name=dec(m[2]).replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
    if(!bySku[sku]) bySku[sku]={sku,url:hm[1],name:'',idx:m.index};
    if(name && name.length>bySku[sku].name.length){ bySku[sku].name=name; if(bySku[sku].idx>m.index)bySku[sku].idx=m.index; }
    bySku[sku].idx=Math.min(bySku[sku].idx,m.index);
  }
  // images by sku (SKU appears in filename; handle -SKU-date and other forms)
  const imgs={};
  const iRe=/https:\/\/www\.wmf\.com\/media\/catalog\/product\/\S+?\.jpg/g; let im;
  while((im=iRe.exec(decoded))){ const u=im[0].split('?')[0];
    let s=(u.match(/-(\d{7,})-\d{6,}/)||u.match(/(?:^|[_-])(\d{9,})(?:[_-]|\.)/)); if(s&&!imgs[s[1]])imgs[s[1]]=u; }
  // prices per sku: slice tile region
  const skus=Object.values(bySku).sort((a,b)=>a.idx-b.idx);
  skus.forEach((p,i)=>{ const end=i+1<skus.length?skus[i+1].idx:p.idx+3500; const seg=h.slice(p.idx,end);
    const amts=[...seg.matchAll(/data-price-amount="([0-9.]+)"/g)].map(x=>parseFloat(x[1]));
    const hasOld=/old-price|special-price/.test(seg);
    if(amts.length){ if(hasOld&&amts.length>=2){p.price=Math.min(...amts);p.msrp=Math.max(...amts);} else p.price=amts[0]; }
    p.image=imgs[p.sku]||null;
  });
  return skus.map(({idx,...r})=>r);
}
