import fs from 'fs';
const dir = 'lost-and-found-mobile/src/screens';

// Replace references to mock data variables with empty arrays
const replacements = {
  'myItems': '[]',
  'allItems': '[]',
  'matches': '[]',
  'chatMessages': '[]',
  'timeline': '[]',
  'notifications': '[]',
  'verificationQuestions': '[]',
  'feedbackOptions': '[]',
};

for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
  const p = dir + '/' + f;
  let c = fs.readFileSync(p, 'utf8');
  let changed = false;
  
  for (const [varName, replacement] of Object.entries(replacements)) {
    // Replace variable references when used as array (not import paths)
    const regex = new RegExp(`(?<!// )\\b${varName}\\b(?![\\s]*[=])`, 'g');
    const newC = c.replace(regex, replacement);
    if (newC !== c) {
      changed = true;
      c = newC;
    }
  }
  
  // Handle 'locations' separately - convert to empty array
  c = c.replace(/(?<!const |let |var |// )\blocations\b(?!\s*=)/g, '[]');
  // Handle 'categories' references (not the CATEGORIES constant)
  c = c.replace(/import.*from.*mockData.*;\n/g, '');
  
  if (changed) {
    fs.writeFileSync(p, c, 'utf8');
    console.log('Fixed:', f);
  }
}
console.log('Done');