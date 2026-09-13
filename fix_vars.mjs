import fs from 'fs';

const dir = 'lost-and-found-mobile/src/screens';
const map = {
  'myItems': '[]',
  'allItems': '[]',
  'matches': '[]',
  'chatMessages': '[]',
  'timeline': '[]',
  'notifications': '[]',
  'verificationQuestions': '[]',
  'feedbackOptions': '[]',
  'locations': '[]'
};

for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith('.js')) continue;
  const p = dir + '/' + f;
  let c = fs.readFileSync(p, 'utf8');
  let changed = false;
  
  for (const [varName, replacement] of Object.entries(map)) {
    // Use a simple approach: split by word boundaries
    const parts = c.split(varName);
    if (parts.length > 1) {
      c = parts.join(replacement);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(p, c, 'utf8');
    console.log('Fixed:', f);
  }
}
console.log('Done');