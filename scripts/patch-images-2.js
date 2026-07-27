const fs = require('fs');
const path = require('path');

function updateFile(filePath, replacements, addImport) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (addImport && !content.includes('import Image from "next/image"')) {
    const firstImport = content.indexOf('import ');
    if (firstImport !== -1) {
      const lineEnd = content.indexOf('\n', firstImport);
      content = content.slice(0, lineEnd + 1) + 'import Image from "next/image";\n' + content.slice(lineEnd + 1);
    }
  }
  
  for (const { from, to } of replacements) {
    if (content.includes(from)) {
      content = content.replace(from, to);
      console.log(`Replaced in ${path.basename(filePath)}`);
    } else {
      console.log(`NOT FOUND in ${path.basename(filePath)}: ${from.slice(0, 60)}...`);
    }
  }
  
  fs.writeFileSync(filePath, content, 'utf-8');
}

const root = 'src';

// BlogSection.tsx
updateFile(path.join(root, 'components/public/sections/BlogSection.tsx'), [
  {
    from: `                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />`,
    to: `                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />`,
  }
], true);

// TestimonialsSection.tsx
updateFile(path.join(root, 'components/public/sections/TestimonialsSection.tsx'), [
  {
    from: `                  <img src={item.imageUrl} alt={item.name} className="w-9 h-9 rounded-full object-cover" />`,
    to: `                  <Image src={item.imageUrl} alt={item.name} width={36} height={36} className="rounded-full object-cover" />`,
  }
], true);

// Blog [slug]/page.tsx
updateFile(path.join(root, 'app/[locale]/blog/[slug]/page.tsx'), [
  {
    from: `          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-56 md:h-72 object-cover rounded-xl mb-8"
          />`,
    to: `          <div className="relative w-full h-56 md:h-72 rounded-xl mb-8 overflow-hidden">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 48rem"
              className="object-cover"
            />
          </div>`,
  }
], true);

console.log('Done batch 2');
