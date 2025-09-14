# 📁 Project Structure

CorrelateAI Pro follows modern web development best practices with organized directories and lowercase naming conventions.

```
correlateai-pro/
├── 📂 .github/             # GitHub Actions and templates
│   └── workflows/
│       └── deploy.yml      # Automated deployment workflow
├── 📂 data/                # Data schemas and references
│   └── schema.md           # API and data structure documentation
├── 📂 docs/                # Project documentation (lowercase naming)
│   ├── api-setup.md        # API configuration guide
│   ├── github-setup.md     # Repository deployment guide
│   ├── deployment.md       # Production deployment
│   ├── dns-setup.md        # Custom domain configuration
│   ├── quick-start.md      # 5-minute setup guide
│   ├── security-checklist.md # Pre-deployment verification
│   ├── technical.md        # Technical architecture
│   ├── development-story.md # AI development journey
│   ├── deployment-checklist.md # Deployment verification
│   └── product-requirements.md # Original requirements
├── 📂 public/              # Static assets
│   ├── CNAME              # Custom domain configuration
│   └── favicon.ico        # Site favicon
├── 📂 scripts/             # Utility scripts
│   └── security-audit.sh  # Automated security checking
├── 📂 src/                 # Source code
│   ├── 📂 components/      # React components
│   │   ├── ui/            # Reusable UI components
│   │   └── SwirlBackground.tsx # Animated background
│   ├── 📂 hooks/          # Custom React hooks
│   ├── 📂 lib/            # Utilities and helpers
│   ├── 📂 services/       # API services and data handling
│   │   └── dataService.ts # FRED & World Bank API integration
│   ├── 📂 styles/         # Global styles and themes
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite build configuration
└── README.md             # Project overview
```

## 🗂️ Directory Conventions

### `/docs` - Documentation
- **Naming**: lowercase with hyphens (kebab-case)
- **Purpose**: All project documentation and guides
- **Format**: Markdown (.md) files
- **Structure**: Organized by topic and user journey

### `/scripts` - Automation
- **Purpose**: Build scripts, utilities, and automation
- **Format**: Shell scripts (.sh), Node.js scripts (.js)
- **Permissions**: Executable files

### `/data` - Data Schemas
- **Purpose**: Data structure documentation and references
- **Content**: API schemas, data models, sample responses
- **Format**: Markdown and JSON files

### `/src` - Source Code
- **Structure**: Feature-based organization
- **Components**: Reusable UI components in `/ui`
- **Services**: API integration and business logic
- **Hooks**: Custom React hooks for state management
- **Styles**: Global styles and theme definitions

## 📝 Naming Conventions

### Files and Directories
- **Documentation**: lowercase with hyphens (`api-setup.md`)
- **Components**: PascalCase (`SwirlBackground.tsx`)
- **Utilities**: camelCase (`dataService.ts`)
- **Stylesheets**: lowercase (`index.css`)
- **Scripts**: lowercase with hyphens (`security-audit.sh`)

### Code Structure
- **Interfaces**: PascalCase (`CorrelationData`)
- **Functions**: camelCase (`generateCorrelation`)
- **Constants**: UPPER_SNAKE_CASE (`FRED_API_KEY`)
- **CSS Classes**: kebab-case (`correlation-card`)

## 🔧 Configuration Files

### Build & Development
- `package.json` - Project metadata and dependencies
- `vite.config.ts` - Build configuration and development server
- `tsconfig.json` - TypeScript compiler options
- `tailwind.config.js` - Tailwind CSS customization
- `.env.example` - Environment variables template

### Version Control
- `.gitignore` - Files excluded from Git tracking
- `.github/workflows/` - GitHub Actions CI/CD pipelines

### Deployment
- `public/CNAME` - Custom domain configuration
- Environment variables for secure API key management

## 📦 Dependencies

### Production Dependencies
```json
{
  "react": "^19.0.0",           // Core React library
  "react-dom": "^19.0.0",       // React DOM rendering
  "@phosphor-icons/react": "^2.1.7", // Icon library
  "@radix-ui/*": "various",     // Accessible UI primitives
  "recharts": "^2.15.1",       // Data visualization
  "sonner": "^2.0.1",          // Toast notifications
  "html2canvas": "^1.4.1",     // Image export functionality
  "tailwind-merge": "^3.0.2",  // Tailwind class merging
  "class-variance-authority": "^0.7.1" // Component variants
}
```

### Development Dependencies
```json
{
  "vite": "^6.3.5",            // Build tool and dev server
  "typescript": "~5.7.2",      // TypeScript compiler
  "tailwindcss": "^4.1.11",    // CSS framework
  "eslint": "^9.28.0",         // Code linting
  "@types/*": "various"        // TypeScript type definitions
}
```

## 🚀 Scripts

### Development
- `npm run dev` - Start development server
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint code analysis

### Production
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally

### Utilities
- `npm run security-audit` - Run security verification script
- `./scripts/security-audit.sh` - Direct security audit execution

## 🔒 Security Structure

### Environment Management
- `.env.example` - Template with safe placeholder values
- `.env` - Local development (gitignored)
- GitHub Secrets - Production environment variables

### API Security
- Environment variables for all API keys
- No hardcoded secrets in source code
- Rate limiting and error handling
- CORS configuration for development/production

### Build Security
- Dependency auditing with `npm audit`
- TypeScript strict mode for type safety
- ESLint rules for code quality
- Automated security audit script

---

**This structure ensures maintainability, security, and scalability for CorrelateAI Pro.**