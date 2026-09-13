import fs from 'fs';

const dir = 'lost-and-found-mobile/src/screens';
const importsToRemove = [
  "import { myItems } from '../data/mockData'",
  "import { allItems } from '../data/mockData'",
  "import { matches } from '../data/mockData'",
  "import { chatMessages } from '../data/mockData'",
  "import { timeline } from '../data/mockData'",
  "import { notifications } from '../data/mockData'",
  "import { verificationQuestions } from '../data/mockData'",
  "import { feedbackOptions } from '../data/mockData'",
  "import { categories } from '../data/mockData'",
  "import { locations, categories } from '../data/mockData'",
];

for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
  const p = dir + '/' + f;
  let c = fs.readFileSync(p, 'utf8');
  let changed = false;

  for (const imp of importsToRemove) {
    while (c.includes(imp)) {
      c = c.replace(imp, '');
      changed = true;
    }
  }

  // Also clean up remnant { [] } patterns
  c = c.replace(/{ \[\] }/g, '');

  // Remove empty lines left from import removal
  c = c.replace(/\n{3,}/g, '\n\n');

  if (changed) {
    fs.writeFileSync(p, c, 'utf8');
    console.log('Cleaned:', f);
  }
}
console.log('Done');