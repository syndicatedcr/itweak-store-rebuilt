import { mkdir, copyFile } from 'node:fs/promises';
const files=['index.html','styles.css','app.mjs','core.mjs','catalog.mjs','icon.svg'];
await mkdir(new URL('./dist/',import.meta.url),{recursive:true});
for(const name of files) await copyFile(new URL(name,import.meta.url),new URL(`dist/${name}`,import.meta.url));
console.log(`Built ${files.length} static assets in dist/.`);
