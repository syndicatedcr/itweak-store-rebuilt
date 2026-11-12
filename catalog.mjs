// Original sample catalog for this reconstruction. These are not installable iOS packages.
export const categories = [
  { name: 'Themes', icon: 'paint', color: 'violet' },
  { name: 'Tweaks', icon: 'sliders', color: 'blue' },
  { name: 'Utilities', icon: 'folder', color: 'orange' },
  { name: 'System', icon: 'gear', color: 'steel' },
  { name: 'Multimedia', icon: 'music', color: 'pink' },
  { name: 'Widgets', icon: 'cloud', color: 'green' },
];
export const demoPackages = [
  ['aurora', 'Aurora', 'Themes', 'A softer glow for your home screen.', 'paint', 'violet', '1.0.0', true, 'Soft color, glassy icons, and a little nostalgia. Try the color swatches below to change the sample home screen.'],
  ['quickpanel', 'QuickPanel', 'Tweaks', 'Little switches. Big convenience.', 'sliders', 'blue', '1.0.0', true, 'A concept for putting everyday controls within reach. The switches below change only this browser preview.'],
  ['pocketfiles', 'PocketFiles', 'Utilities', 'Everything in its right place.', 'folder', 'orange', '1.0.0', true, 'A classic file-browser concept with grouped folders and a clean, familiar interface. No device files are accessed.'],
  ['classicboard', 'ClassicBoard', 'Themes', 'Bring back the shine.', 'grid', 'green', '1.0.0', true, 'A tribute to the glossy icons and textured backgrounds of early iOS. Preview a different color palette below.'],
  ['statuslight', 'StatusLight', 'System', 'A little clarity at the top.', 'bolt', 'steel', '1.0.0', true, 'A minimal status-bar customization concept. Explore the sample interface; it does not modify your actual status bar.'],
  ['miniplayer', 'MiniPlayer', 'Multimedia', 'Your music, front and center.', 'music', 'pink', '1.0.0', true, 'A compact playback-control concept. This sample contains no music and does not control device audio.'],
  ['daybreak', 'Daybreak', 'Widgets', 'A brighter start to your day.', 'cloud', 'blue', '1.0.0', false, 'A weather-widget concept with sample conditions. No location is requested and the preview is not a live forecast.'],
  ['nightglass', 'NightGlass', 'Themes', 'After dark, with a touch of glass.', 'paint', 'night', '1.0.0', false, 'A midnight palette for the classic home-screen look. Switch between the included preview colors below.'],
  ['tapclock', 'TapClock', 'Widgets', 'Make a little time.', 'clock', 'orange', '1.0.0', false, 'An oversized clock-widget concept inspired by classic digital displays.'],
  ['launchpad', 'LaunchPad', 'Tweaks', 'A shortcut to your favorites.', 'bolt', 'green', '1.0.0', false, 'A simple launcher concept for keeping favorite actions close at hand.'],
  ['tidydock', 'TidyDock', 'System', 'A calmer place to land.', 'grid', 'blue', '1.0.0', false, 'A simplified dock concept with room to breathe and a familiar glass shelf.'],
  ['notepocket', 'NotePocket', 'Utilities', 'Small thoughts, neatly kept.', 'folder', 'gold', '1.0.0', false, 'A pocket-notebook concept inspired by the textures and colors of early mobile apps.'],
].map(([id, name, category, tagline, icon, color, version, featured, description], i) => ({id, name, category, tagline, icon, color, version, featured, description, author: 'iTweak demo catalog', added: `2026-11-${String(12 - Math.floor(i / 3)).padStart(2, '0')}`, demo: true}));
