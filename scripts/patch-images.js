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

// HomePageClient.tsx
updateFile(path.join(root, 'components/public/HomePageClient.tsx'), [
  {
    from: `                  <img
                    src={profile.photoUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />`,
    to: `                  <Image
                    src={profile.photoUrl}
                    alt={profile.fullName}
                    fill
                    sizes="(max-width: 768px) 10rem, 16rem"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />`,
  }
], true);

// AboutPageClient.tsx
updateFile(path.join(root, 'components/public/AboutPageClient.tsx'), [
  {
    from: `                <img
                  src={profile.photoUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />`,
    to: `                <Image
                  src={profile.photoUrl}
                  alt={profile.fullName}
                  fill
                  sizes="10rem"
                  className="object-cover"
                />`,
  }
], true);

// ProjectsSection.tsx
updateFile(path.join(root, 'components/public/sections/ProjectsSection.tsx'), [
  {
    from: `                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />`,
    to: `                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />`,
  }
], true);

console.log('Done');
