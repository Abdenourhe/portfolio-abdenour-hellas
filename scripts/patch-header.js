const fs = require('fs');

let content = fs.readFileSync('src/components/public/Header.tsx', 'utf-8');

// Replace imports
content = content.replace(
  `import { Menu, X, Sun, Moon, ChevronUp } from "lucide-react";
import { useTheme } from "./ThemeProvider";`,
  `import { Menu, X, ChevronUp } from "lucide-react";
import ThemeSelector from "./ThemeSelector";`
);

// Remove useTheme destructuring
content = content.replace(
  `const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();`,
  `const pathname = usePathname();`
);

// Replace desktop toggle button
content = content.replace(
  `          <button
            onClick={toggleTheme}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
            aria-label={theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>`,
  `          <ThemeSelector />`
);

// Replace mobile toggle button
content = content.replace(
  `              <button
                onClick={toggleTheme}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                aria-label={theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"}
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>`,
  `              <ThemeSelector />`
);

fs.writeFileSync('src/components/public/Header.tsx', content, 'utf-8');
console.log('Header updated');
