export const CATEGORY_NAMES = ['Themes', 'Tweaks', 'Utilities', 'System', 'Multimedia', 'Widgets'];
const ICONS = ['gear', 'paint', 'sliders', 'star', 'folder', 'music', 'bolt', 'clock', 'cloud', 'grid', 'heart'];
const COLORS = ['violet', 'blue', 'orange', 'steel', 'pink', 'green', 'night', 'gold'];
export function escapeHTML(value) { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c])); }
export function filterPackages(packages, { query = '', category = '', saved = null, featured = false, sort = 'name' } = {}) {
  const needle = query.trim().toLowerCase();
  return packages.filter(p => (!category || p.category === category) && (!saved || saved.has(p.id)) && (!featured || p.featured) && (!needle || [p.name, p.tagline, p.description, p.author, p.category].join(' ').toLowerCase().includes(needle)))
    .sort((a, b) => sort === 'newest' ? b.added.localeCompare(a.added) || a.name.localeCompare(b.name) : a.name.localeCompare(b.name));
}
export function parseCatalog(text) {
  if (typeof text !== 'string' || text.length > 1_000_000) throw new Error('Choose a JSON catalog smaller than 1 MB.');
  let source; try { source = JSON.parse(text); } catch { throw new Error('That file is not valid JSON.'); }
  if (!source || typeof source !== 'object' || source.schemaVersion !== 1 || !Array.isArray(source.packages) || source.packages.length > 500) throw new Error('Use schemaVersion 1 with up to 500 packages.');
  const ids = new Set();
  const string = (p, key, max, fallback) => { const value = p[key] ?? fallback; if (typeof value !== 'string' || !value.trim() || value.length > max) throw new Error(`Every package needs a valid ${key} (up to ${max} characters).`); return value.trim(); };
  const packages = source.packages.map(p => {
    if (!p || typeof p !== 'object' || Array.isArray(p)) throw new Error('Every package must be an object.');
    const id = string(p, 'id', 80);
    if (!/^[a-z0-9][a-z0-9._-]*$/.test(id) || ids.has(id)) throw new Error('Package IDs must be unique lowercase letters, digits, dots, underscores, or hyphens.');
    ids.add(id);
    if (!CATEGORY_NAMES.includes(p.category)) throw new Error(`Choose one of these categories: ${CATEGORY_NAMES.join(', ')}.`);
    const added = string(p, 'added', 10, '2026-11-12');
    const parsedDate = new Date(`${added}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(added) || Number.isNaN(parsedDate.valueOf()) || parsedDate.toISOString().slice(0,10) !== added) throw new Error('Use real dates in YYYY-MM-DD format.');
    let homepage = '';
    if (p.homepage) { try { const u = new URL(p.homepage); if (u.protocol !== 'https:') throw new Error(); homepage = u.href; } catch { throw new Error('Package homepage links must start with https://.'); } }
    return {id, name:string(p,'name',80), category:p.category, tagline:string(p,'tagline',140), description:string(p,'description',2000), author:string(p,'author',100,'Catalog contributor'), version:string(p,'version',40,'1.0.0'), icon:ICONS.includes(p.icon)?p.icon:'folder', color:COLORS.includes(p.color)?p.color:'blue', added, homepage, featured:p.featured === true, demo:p.demo === true};
  });
  return {schemaVersion:1, name:typeof source.name === 'string' ? source.name.slice(0,80) : 'My catalog', packages};
}
export function serializeCatalog(name, packages) { return JSON.stringify({schemaVersion:1, name, packages}, null, 2); }
