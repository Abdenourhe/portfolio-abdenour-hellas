const fs = require('fs');
const path = require('path');

function patchRelative(filePath, selector) {
  let content = fs.readFileSync(filePath, 'utf-8');
  if (content.includes(selector)) {
    content = content.replace(selector, selector.replace('className="', 'className="relative '));
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Patched relative in ${path.basename(filePath)}`);
  } else {
    console.log(`Selector not found in ${path.basename(filePath)}`);
  }
}

const root = 'src';

patchRelative(
  path.join(root, 'components/public/AboutPageClient.tsx'),
  '<div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden ring-2 ring-primary/20 bg-muted">'
);

patchRelative(
  path.join(root, 'components/public/sections/ProjectsSection.tsx'),
  '<div className="w-full h-44 md:h-52 overflow-hidden">'
);

patchRelative(
  path.join(root, 'components/public/sections/BlogSection.tsx'),
  '<div className="w-full h-44 overflow-hidden">'
);

console.log('Done');
