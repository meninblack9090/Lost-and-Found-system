import fs from 'fs';

const dir = 'lost-and-found-mobile/src/screens';

for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
  const p = dir + '/' + f;
  let c = fs.readFileSync(p, 'utf8');
  let changed = false;

  // Remove import lines with mockData
  const lines = c.split('\n');
  const filtered = lines.filter(line => !line.includes("'../data/mockData'"));
  if (filtered.length !== lines.length) {
    c = filtered.join('\n');
    changed = true;
  }

  // Remove any remnant { [] } patterns from variable replacements
  c = c.replace(/{ \[\] }/g, '');

  // Fix double commas that might have been left
  c = c.replace(/, ,/g, ',');
  c = c.replace(/{, /g, '{');

  if (changed) {
    fs.writeFileSync(p, c, 'utf8');
    console.log('Fixed:', f);
  }
}
console.log('Done');