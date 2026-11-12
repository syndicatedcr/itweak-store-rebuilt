import { categories, demoPackages } from './catalog.mjs';
import { escapeHTML as esc, filterPackages, parseCatalog, serializeCatalog } from './core.mjs';

const $ = selector => document.querySelector(selector);
const icon = (name, color = 'blue', extra = '') => `<span class="app-icon ${color} ${extra}" aria-hidden="true"><svg><use href="#i-${name}"/></svg></span>`;
const glyph = name => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const storageKey = 'itweak-rebuilt-v1';
let saved = new Set(), customCatalog = null, sort = 'name', activeId = null, toastTimer;
try {
  const state = JSON.parse(localStorage.getItem(storageKey) || '{}');
  if (Array.isArray(state.saved)) saved = new Set(state.saved.filter(x => typeof x === 'string'));
  if (state.catalog) customCatalog = parseCatalog(JSON.stringify(state.catalog));
} catch { /* A damaged or unavailable browser store must not prevent browsing. */ }
const packages = () => customCatalog?.packages || demoPackages;
const catalogName = () => customCatalog?.name || 'Demo catalog';
function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify({saved:[...saved], catalog:customCatalog})); return true; }
  catch { toast('Browser storage is unavailable. Changes will last for this visit only.'); return false; }
}
function toast(message) { clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').classList.add('show'); toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 4000); }
function route() { return location.hash.slice(1).split('?')[0] || 'home'; }
function go(target) { if (route() === target) render(); else location.hash = target; }
const countSaved = () => packages().filter(p => saved.has(p.id)).length;

function renderNavigation() {
  const current = route();
  $('#navigation').innerHTML = [['home','star','Featured'],['new','clock','New packages'],['genres','grid','Genres'],['saved','heart','Saved packages']].map(([r,i,n]) => `<button class="nav-item ${current === r ? 'active' : ''}" data-route="${r}" ${current === r ? 'aria-current="page"' : ''}>${glyph(i)}<span>${n}</span>${r === 'saved' ? `<span class="count">${countSaved()}</span>` : ''}</button>`).join('');
  $('#categories').innerHTML = categories.map(c => `<button class="nav-item ${current === 'category/'+c.name ? 'active' : ''}" data-route="category/${c.name}" ${current === 'category/'+c.name ? 'aria-current="page"' : ''}><span class="mini-dot ${c.color}"></span><span>${c.name}</span></button>`).join('');
  $('#store-tab').classList.toggle('active', current !== 'updates');
  $('#updates-tab').classList.toggle('active', current === 'updates');
  $('#store-tab').setAttribute('aria-pressed', String(current !== 'updates'));
  $('#updates-tab').setAttribute('aria-pressed', String(current === 'updates'));
  $('#catalog-status').textContent = `${catalogName()} · ${packages().length} packages`;
}

function row(p) {
  return `<button class="package-row" data-package="${esc(p.id)}" aria-label="View ${esc(p.name)}">${icon(p.icon,p.color)}<span class="package-copy"><strong>${esc(p.name)}</strong><small>${esc(p.tagline)}</small></span><span class="package-tag">${esc(p.category)}</span><span class="chevron" aria-hidden="true">›</span></button>`;
}
const list = items => `<div class="package-list">${items.map(row).join('')}</div>`;
const heading = (title, subtitle) => `<div class="page-heading"><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div>`;
function home() {
  const featured = filterPackages(packages(), {featured:true}).slice(0,6);
  return `<section class="hero"><div><div class="eyebrow">A familiar place to discover</div><h1>Welcome back.</h1><p>Tweaks, themes, and little possibilities. Rediscover the spirit of early iOS.</p><button class="primary-button" data-route="all">Browse packages <span>→</span></button></div><div class="coverflow" aria-hidden="true">${icon('music','orange')}${icon('sliders','green')}${icon('gear','steel')}${icon('paint','blue')}</div></section>
    <div class="section-heading"><h2>Featured packages</h2><button class="text-button" data-route="all">View all packages →</button></div>
    ${featured.length ? `<div class="featured-grid">${featured.map(p => `<div class="package-list">${row(p)}</div>`).join('')}</div>` : empty('No featured packages yet', 'Browse your catalog to see all available entries.')}
    <div class="intro-note"><span aria-hidden="true">ⓘ</span><span>${customCatalog ? 'Your imported catalog. Open an entry to see its details and project link.' : 'Sample packages bring the original idea to life. This remake does not install iOS software.'}</span></div>
    <div class="bottom-banner">${glyph('folder')}<div><strong>Make a little space for your favorites.</strong><p>Save packages to your own collection, right in this browser.</p></div><button class="text-button" data-route="saved">My collection →</button></div>`;
}
function empty(title, message, button = true) { return `<div class="empty">${glyph('folder')}<h2>${esc(title)}</h2><p>${esc(message)}</p>${button ? '<button class="secondary-button" data-route="all">Explore packages</button>' : ''}</div>`; }
function listing(kind, category = '') {
  const query = kind === 'search' ? $('#search').value : '';
  const titles = {all:['All packages','A little something for every corner of your device.'],new:['New packages','The latest additions to this catalog.'],saved:['Your collection','Favorites saved in this browser, ready for another look.'],search:['Search packages',query ? `Results for “${query}”` : 'Search by name, description, author, or genre.'],category:[category,`Explore ${category.toLowerCase()} in ${catalogName().toLowerCase()}.`]};
  const items = filterPackages(packages(), {query, category, saved:kind === 'saved' ? saved : null, sort:kind === 'new' ? 'newest' : sort});
  return heading(...titles[kind]) + `<div class="filter-line"><span>${items.length} ${items.length === 1 ? 'package' : 'packages'}${kind === 'saved' ? ' saved' : ''}</span><label>Sort by <select id="sort" aria-label="Sort packages"><option value="name" ${sort === 'name' && kind !== 'new' ? 'selected' : ''}>Name</option><option value="newest" ${sort === 'newest' || kind === 'new' ? 'selected' : ''}>Newest</option></select></label></div>` + (items.length ? list(items) : empty(kind === 'saved' ? 'Your collection starts here.' : 'No packages found', kind === 'saved' ? 'Open a package and choose “Save to collection” to keep it here.' : 'Try a different search, or browse the full catalog.', kind !== 'search')) + (kind === 'saved' && items.length ? '<div class="action-line"><button class="secondary-button" data-action="export-saved">Export collection</button></div>' : '');
}
function genres() { return heading('Select a genre', 'Find your kind of customization.') + `<div class="genre-grid">${categories.map(c => `<button class="genre-card" data-route="category/${c.name}">${icon(c.icon,c.color)}<strong>${c.name}</strong><small>${packages().filter(p => p.category === c.name).length} packages</small></button>`).join('')}</div>`; }
function about() { return heading('An old idea. A fresh start.', 'iTweak Store · 2026 reconstruction · v0.1.0') + `<article class="prose-card"><h2>Remember when everything had a little shine?</h2><p>iTweak Store was a 2012 project exploring a browser-based alternative to Cydia. This new implementation recreates the visual spirit of that idea: blue toolbars, pinstripes, glossy icons, and a familiar place to browse.</p><p>Casey, known as CaseyTal, was identified as a team member in the <a href="https://www.idownloadblog.com/2012/03/01/itweak-store-interview/" target="_blank" rel="noopener">original iDownloadBlog interview</a>.</p></article><article class="prose-card"><h2>Built again, from the beginning.</h2><p>The original code was never publicly released and is not available to this project. This is a new implementation based on supplied screenshots and public descriptions, not recovered source or a continuation of the original codebase.</p><p>Browsing, search, collection saving, and JSON catalog import/export work. Included package entries are fictional examples. Device installation, APT repository support, accounts, payments, and automatic package updates are not implemented.</p><p>New source code and icons are provided under the MIT license. The license does not grant rights to third-party names or trademarks.</p><div class="action-line"><a class="primary-button" href="https://github.com/syndicatedcr/itweak-store-rebuilt" target="_blank" rel="noopener">View source code ↗</a><button class="secondary-button" data-route="catalog">Manage catalog</button></div></article>`; }
function news() { return heading('News from iTweak', 'A new chapter, with a familiar face.') + `<article class="prose-card"><span class="label">November 12, 2026 · Reconstruction</span><h2>Hello again, iTweak.</h2><p>The classic concept has a new browser interface. Explore a sample catalog, try a couple of interactive previews, and keep your favorite entries in a collection.</p><p>This first version also accepts a simple JSON catalog, making it possible to list real projects as the reconstruction develops.</p><button class="secondary-button" data-route="catalog">Explore catalog tools</button></article><article class="prose-card"><span class="label">March 1, 2012 · From the archive</span><h2>Where the idea began.</h2><p>An interview with the original team described a store that would work through Safari, with companion desktop clients planned.</p><a href="https://www.idownloadblog.com/2012/03/01/itweak-store-interview/" target="_blank" rel="noopener">Read the original interview ↗</a></article>`; }
function updates() { return heading('Updates', 'What’s new in the reconstruction.') + `<article class="prose-card"><span class="label">Version 0.1.0 · November 12, 2026</span><h2>The first rebuild is here.</h2><ul><li>A responsive interface inspired by the 2012 screenshots.</li><li>Search, genre browsing, package details, and collection saving.</li><li>Interactive theme and quick-switch previews.</li><li>Import your own catalog and export your collection.</li></ul></article><div class="intro-note"><span aria-hidden="true">ⓘ</span><span>This page tracks the web app. It does not detect or update packages installed on a device.</span></div>`; }
function catalog() { return heading('Your catalog', 'Give the familiar interface something of your own.') + `<article class="prose-card"><h2>${esc(catalogName())}</h2><p>${packages().length} entries available. Download the current catalog, edit it, and import your version. You can add real project links without needing a server.</p><div class="action-line"><button class="secondary-button" data-action="export-catalog">Export current catalog</button><button class="secondary-button" data-action="export-demo">Download example</button></div></article><article class="prose-card"><h2>Import a JSON catalog</h2><p>Importing replaces the catalog in this browser. Export your current catalog first if you want to keep a copy. Nothing is uploaded to a server.</p><input class="file-input" id="catalog-file" type="file" accept=".json,application/json" aria-label="Import JSON catalog"><div id="import-message" role="status"></div><p style="margin-top:14px">Use <code>schemaVersion: 1</code> and a <code>packages</code> array. The downloadable example includes all required fields. Up to 500 entries, under 1 MB.</p></article>${customCatalog ? '<article class="prose-card"><h2>Back to the beginning</h2><p>Restore the original sample catalog. Your saved IDs are kept, and your imported catalog will be removed from this browser.</p><button class="secondary-button" data-action="restore-demo">Restore demo catalog</button></article>' : ''}`; }

function render() {
  let current = route();
  if (current !== 'search') $('#search').value = '';
  const routes = {home,genres,about,news,updates,catalog};
  let html;
  if (routes[current]) html = routes[current]();
  else if (['all','new','saved','search'].includes(current)) html = listing(current);
  else if (current.startsWith('category/') && categories.some(c => c.name === current.slice(9))) html = listing('category',current.slice(9));
  else html = heading('This page wandered off.', 'Head back to the store to find your way.') + '<button class="primary-button" data-route="home">Back to the store</button>';
  $('#main').innerHTML = html;
  renderNavigation();
  document.title = `${current === 'home' ? 'iTweak Store' : $('#main h1')?.textContent || 'iTweak'} — Rebuilt`;
}

function preview(p) {
  if (!p.demo) return '';
  if (p.category === 'Themes') return `<section class="preview"><span class="label">Interactive theme preview</span><div class="preview-screen" id="theme-screen"><div class="preview-clock">10:27</div><div class="preview-apps">${[['music','pink'],['cloud','blue'],['folder','orange'],['gear','steel'],['sliders','green'],['paint','violet'],['clock','gold'],['bolt','blue']].map(([i,c])=>icon(i,c)).join('')}</div></div><div class="swatches">${[['Aurora','#a0aed4','#d7becf'],['Midnight','#333c66','#7a648c'],['Ocean','#5e9cab','#b5d5c6'],['Sunset','#e0a07e','#e6c5ad']].map(([n,a,b],i) => `<button class="swatch" data-theme="${a},${b}" style="background:${a}" aria-label="${n} theme" aria-pressed="${i === 0}"></button>`).join('')}</div></section>`;
  if (p.id === 'quickpanel') return `<section class="preview"><span class="label">Try the controls · preview only</span>${['Wi-Fi','Bluetooth','Do Not Disturb'].map((n,i) => `<div class="toggle-row"><span>${n}</span><button class="toggle" role="switch" aria-checked="${i===0}" aria-label="${n} preview" data-action="toggle-preview"></button></div>`).join('')}</section>`;
  return '';
}
function showDetail(id, open = true) {
  const p = packages().find(p=>p.id===id); if (!p) return;
  activeId = p.id;
  $('#detail-content').innerHTML = `<header class="dialog-bar"><span>Package details</span><button class="chrome-button" data-action="close-detail">Done</button></header><div class="detail-body"><div class="detail-header">${icon(p.icon,p.color)}<div><h1 id="detail-title">${esc(p.name)}</h1><p>${esc(p.tagline)}</p><span class="label">${p.demo ? 'Sample package' : 'Catalog entry'} · ${esc(p.category)}</span></div></div><p class="detail-description">${esc(p.description)}</p><div class="detail-meta"><div><span>Version</span>${esc(p.version)}</div><div><span>By</span>${esc(p.author)}</div><div><span>Added</span>${esc(p.added)}</div></div><button class="primary-button" data-action="save" aria-pressed="${saved.has(p.id)}">${saved.has(p.id) ? '♥ Saved · remove from collection' : '♡ Save to collection'}</button>${p.homepage ? `<a class="secondary-button" href="${esc(p.homepage)}" target="_blank" rel="noopener noreferrer">Visit project ↗</a>` : ''}<p class="detail-notice">${p.demo ? 'This is a fictional sample, not an installable iOS package.' : 'This catalog entry is supplied by your imported file. Project information and links have not been independently verified.'}</p>${preview(p)}</div>`;
  if (open) $('#detail').showModal();
}
function download(name, data) {
  const url = URL.createObjectURL(new Blob([data], {type:'application/json'}));
  const a = document.createElement('a'); a.href=url; a.download=name; document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}

document.addEventListener('click', event => {
  if (event.target.closest('.skip')) { event.preventDefault(); $('#main').focus(); return; }
  const target = event.target.closest('button[data-route],button[data-package],button[data-action],button[data-theme]'); if (!target) return;
  if (target.dataset.route) return go(target.dataset.route);
  if (target.dataset.package) return showDetail(target.dataset.package);
  if (target.dataset.theme) { const [a,b] = target.dataset.theme.split(','); $('#theme-screen').style.background=`linear-gradient(140deg,${a},${b})`; document.querySelectorAll('.swatch').forEach(el=>el.setAttribute('aria-pressed',String(el===target))); return; }
  const action = target.dataset.action;
  if (action === 'close-detail') $('#detail').close();
  if (action === 'save') { const wasSaved=saved.has(activeId); wasSaved?saved.delete(activeId):saved.add(activeId); const persisted=persist(); showDetail(activeId,false); render(); if(persisted) toast(wasSaved?'Removed from your collection.':'Saved to your collection.'); $('#detail [data-action="save"]').focus(); }
  if (action === 'toggle-preview') target.setAttribute('aria-checked',String(target.getAttribute('aria-checked')!=='true'));
  if (action === 'export-catalog') download('itweak-catalog.json',serializeCatalog(catalogName(),packages()));
  if (action === 'export-demo') download('itweak-example.json',serializeCatalog('Demo catalog',demoPackages));
  if (action === 'export-saved') download('itweak-collection.json',serializeCatalog('My collection',packages().filter(p=>saved.has(p.id))));
  if (action === 'restore-demo') { customCatalog=null; const persisted=persist(); render(); if(persisted) toast('Demo catalog restored.'); }
});
document.addEventListener('change', async event => {
  if (event.target.id === 'sort') { sort=event.target.value; if(route()==='new' && sort==='name') go('all'); else render(); }
  if (event.target.id === 'catalog-file') {
    const file=event.target.files?.[0]; if(!file) return;
    try {
      if(file.size>1_000_000) throw new Error('Choose a JSON catalog smaller than 1 MB.');
      const parsed=parseCatalog(await file.text()); customCatalog=parsed; const persisted=persist(); render();
      if (persisted) toast(`Imported ${parsed.packages.length} packages into your catalog.`);
    } catch(error) { $('#import-message').textContent=error.message; $('#import-message').className='error'; }
  }
});
$('#search').addEventListener('input',()=>{if(route()!=='search') {history.replaceState(null,'','#search');} render();});
document.addEventListener('keydown',event=>{if(event.key==='/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName) && !$('#detail').open) {event.preventDefault();$('#search').focus();}});
$('#detail').addEventListener('click',event=>{if(event.target===$('#detail')) {const r=$('#detail').getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) $('#detail').close();}});
window.addEventListener('hashchange',()=>{if($('#detail').open) $('#detail').close();render();$('#main').focus({preventScroll:true});});
render();
