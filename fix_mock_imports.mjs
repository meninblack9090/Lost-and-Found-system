import fs from 'fs';

const dir = 'lost-and-found-mobile/src/screens';
const files = fs.readdirSync(dir);

for (const f of files) {
  if (!f.endsWith('.js')) continue;
  const p = dir + '/' + f;
  let c = fs.readFileSync(p, 'utf8');
  if (c.includes("from '../data/mockData'")) {
    // Remove the import line
    c = c.replace(/import.*from.*mockData.*;\n/g, '');
    fs.writeFileSync(p, c, 'utf8');
    console.log('Fixed:', f);
  }
}
console.log('Done');