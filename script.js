// NESTORA V2 — affiliate catalog
// Replace YOUR-TAG-21 with your approved Amazon Associates tracking ID.
const AFFILIATE_TAG = "YOUR-TAG-21";
const products=[
["Top Pick","▣","House of Quirk Under-Sink 2-Tier Basket Organizer","₹767","₹1,999","4.2","1k+","Kitchen / Bathroom","https://www.amazon.in/dp/B0F8ZY87Z1"],
["Space Saver","▤","PULSBERY 4-Layer Slim Storage Rack with Wheels","₹900","₹2,060","4.2","1.2k+","Small Space","https://www.amazon.in/dp/B0C4K167CP"],
["Best Value","▥","SHIOK DCOR 2-Tier Metal Storage Rack","₹574","₹999","4.3","1k+","Kitchen / Bathroom","https://www.amazon.in/dp/B0FZHQGVVL"],
["Wall Storage","◇","iSTAR Metal Wall-Mount Floating Shelves (Pack of 2)","₹538","₹999","4.2","500+","Bedroom / Workspace","https://www.amazon.in/s?k=iSTAR+Metal+Multi-Purpose+Wall+Mount+Floating+Shelf"],
["Under ₹800","□","PULSBERY 3-Layer Slim Storage Rack","₹749","₹1,700","4.2","1k+","Kitchen / Utility","https://www.amazon.in/dp/B0CPQ6434K"],
["Kitchen Pick","▦","2-Tier Multipurpose Countertop Organizer Rack","₹999","","","","Kitchen","https://www.amazon.in/s?k=2+Tier+Multipurpose+Countertop+Organizer+Rack"],
["Bathroom","⌂","Plantex Multipurpose Bathroom Shelf with Hooks","₹485","","","","Bathroom","https://www.amazon.in/s?k=Plantex+Multipurpose+Bathroom+Shelf+with+Hooks"],
["Desk Pick","▤","Multipurpose Desk Drawer Organizer","₹339","","","","Workspace","https://www.amazon.in/s?k=desk+drawer+organizer+home+office"],
["Bedroom","▥","5-Tier Fabric Storage Shelf Organizer","₹599","","4.2","500+","Bedroom","https://www.amazon.in/s?k=Vancefame+5-Tier+Fabric+Storage+Shelf+Organizer"]
];
function aff(url){if(AFFILIATE_TAG==='YOUR-TAG-21')return url;return url+(url.includes('?')?'&':'?')+'tag='+encodeURIComponent(AFFILIATE_TAG)}
const grid=document.getElementById('productGrid');
grid.innerHTML=products.map(p=>{const d=p[4]?Math.round((1-parseInt(p[3].replace(/[₹,]/g,''))/parseInt(p[4].replace(/[₹,]/g,'')))*100):0;return `<article class="product"><span class="badge">${p[0]}</span><a class="product-img" href="${aff(p[8])}" target="_blank" rel="nofollow sponsored noopener"><span class="product-icon">${p[1]}</span><span class="category-pill">${p[7]}</span></a><h3>${p[2]}</h3>${p[5]?`<div class="stars">★★★★★ <span>${p[5]} · ${p[6]}</span></div>`:`<div class="stars muted">See current details on Amazon</div>`}<p class="price">${p[3]} ${p[4]?`<span class="old">${p[4]}</span><span class="discount">${d}% off</span>`:''}</p><a class="check-btn" href="${aff(p[8])}" target="_blank" rel="nofollow sponsored noopener">Check Price on Amazon →</a></article>`}).join('');
function toggleMenu(){document.getElementById('mobileMenu').classList.toggle('open')}
function focusSearch(){showToast('Search will be connected after the product catalog is finalized.')}
function subscribe(e){e.preventDefault();showToast('Thanks! Welcome to NESTORA Insider.');e.target.reset()}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
