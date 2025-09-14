# Technical Documentation: CorrelateAI Pro

## 🏗️ Architecture Overview

CorrelateAI Pro is a React-based single-page application that demonstrates real-time data correlation analysis using authentic economic datasets.

### Core Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   React App     │    │   Vite Proxy │    │   External APIs │
│   (Frontend)    │◄──►│   (CORS)     │◄──►│   FRED + WB     │
└─────────────────┘    └──────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│  Local Storage  │
│  (Favorites)    │
└─────────────────┘
```

## 🔧 Technology Stack

### Frontend Framework
- **React 19.0.0**: Latest React with concurrent features
- **TypeScript 5.x**: Type-safe development
- **Vite 6.3.6**: Fast build tool and dev server

### UI & Styling
- **Tailwind CSS v4**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **Phosphor Icons**: Modern icon library
- **Recharts**: Data visualization library

### Data & APIs
- **FRED API**: Federal Reserve Economic Data
- **World Bank API**: Global development indicators
- **Proxy Configuration**: CORS handling via Vite

## 📊 Data Architecture

### Dataset Structure
```typescript
interface RealDataset {
  id: string
  name: string
  description: string
  unit: string
  source: 'fred' | 'worldbank'
  category: string
  seriesId: string
  endpoint: string
}
```

### Correlation Data Model
```typescript
interface CorrelationData {
  id: string
  title: string
  description: string
  correlation: number
  rSquared: number
  data: Array<{ year: number; value1: number; value2: number }>
  variable1: RealDataset
  variable2: RealDataset
  citation: string
  journal: string
  year: number
  isRealData: boolean
  dataSource: string
}
```

## 🌐 API Integration

### FRED API (Federal Reserve)
- **Base URL**: `https://api.stlouisfed.org/fred/`
- **Authentication**: API Key required
- **Rate Limits**: 120 requests/minute
- **Data Format**: JSON
- **Proxy Route**: `/fred/*`

### World Bank API
- **Base URL**: `https://api.worldbank.org/v2/`
- **Authentication**: None (public)
- **Rate Limits**: Generous (not specified)
- **Data Format**: JSON
- **Proxy Route**: `/worldbank/*`

### Proxy Configuration (vite.config.ts)
```typescript
server: {
  proxy: {
    '/fred': {
      target: 'https://api.stlouisfed.org/fred',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/fred/, ''),
    },
    '/worldbank': {
      target: 'https://api.worldbank.org/v2',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/worldbank/, ''),
    }
  }
}
```

## 🎨 Component Architecture

### Main Components
```
App.tsx
├── HeaderComponent (inline)
├── TabsComponent
│   ├── GenerateTab
│   │   ├── DatasetSelectors
│   │   ├── GenerateButton
│   │   └── CorrelationDisplay
│   └── FavoritesTab
│       └── FavoritesList
├── CorrelationCard (component)
└── FooterComponent (inline)
```

### State Management
- **React Hooks**: useState, useEffect, useCallback, useMemo
- **Local Storage**: Persistent favorites
- **Error Boundaries**: ErrorFallback component

## 🔄 Data Flow

### Correlation Generation Process
1. **User Selection**: Choose two datasets from dropdowns
2. **API Calls**: Parallel requests to FRED/World Bank APIs
3. **Data Processing**: Clean and align time series data
4. **Statistical Analysis**: Calculate Pearson correlation coefficient
5. **UI Update**: Display results with visualization
6. **Persistence**: Option to save to favorites

### Error Handling
- **API Failures**: Graceful degradation with user feedback
- **Network Issues**: Retry mechanisms
- **Data Quality**: Validation and cleaning
- **Type Safety**: TypeScript compile-time checks

## 📱 Responsive Design

### Breakpoint Strategy
- **Mobile First**: Base styles for mobile devices
- **Tablet**: md: breakpoints (768px+)
- **Desktop**: lg: breakpoints (1024px+)
- **Wide Desktop**: xl: breakpoints (1280px+)

### Key Responsive Features
- **Flexible Grid**: CSS Grid and Flexbox layouts
- **Adaptive Typography**: Responsive font sizes
- **Touch Targets**: Appropriate button sizes
- **Navigation**: Collapsible mobile menu

## 🔍 Performance Optimizations

### Code Splitting
- **React.lazy()**: Component-level code splitting
- **Dynamic Imports**: Feature-based loading
- **Bundle Analysis**: Vite bundle analyzer

### Data Optimization
- **Memoization**: useMemo for expensive calculations
- **Debouncing**: API call optimization
- **Caching**: Local storage for favorites
- **Lazy Loading**: Images and charts

### Build Optimization
```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        ui: ['@radix-ui/react-select', '@radix-ui/react-dialog'],
        charts: ['recharts']
      }
    }
  }
}
```

## 🧪 Testing Strategy

### Type Safety
- **TypeScript**: Compile-time error detection
- **Strict Mode**: Enhanced type checking
- **Interface Definitions**: Clear data contracts

### Error Boundaries
- **React Error Boundary**: Component-level error handling
- **Fallback UI**: Graceful error displays
- **Error Reporting**: Console logging for debugging

## 🚀 Deployment

### Build Process
```bash
npm run build    # Production build
npm run preview  # Preview production build
npm run dev      # Development server
```

### Environment Variables
```bash
VITE_FRED_API_KEY=your_api_key
VITE_APP_NAME=CorrelateAI Pro
VITE_APP_VERSION=1.0.0
```

### Deployment Targets
- **Vercel**: Recommended for React apps
- **Netlify**: Alternative with similar features
- **GitHub Pages**: Static hosting option
- **Self-hosted**: Any static file server

## 🔐 Security Considerations

### API Security
- **API Keys**: Client-side keys (FRED requires this approach)
- **CORS**: Handled via Vite proxy in development
- **Rate Limiting**: Implemented in API calls
- **Input Validation**: TypeScript + runtime checks

### Content Security
- **XSS Prevention**: React's built-in protections
- **External Links**: Proper rel attributes
- **Data Sanitization**: Validated API responses

## 📈 Monitoring & Analytics

### Development Monitoring
- **Vite Dev Server**: Hot reload and error display
- **Browser DevTools**: Console logging
- **Network Tab**: API call monitoring
- **TypeScript Compiler**: Real-time error checking

### Production Considerations
- **Error Tracking**: Sentry or similar service
- **Performance Monitoring**: Web Vitals
- **Usage Analytics**: Privacy-focused analytics
- **API Monitoring**: Track API success rates

## 🤖 AI Development Notes

### AI-Generated Components
- **100% AI Code**: All components generated via conversation
- **Iterative Refinement**: Features added through natural language
- **Context Preservation**: AI maintained architectural consistency
- **Quality Control**: Human oversight for final polish

### AI Limitations Encountered
- **Complex Debugging**: Required human problem-solving
- **API Integration**: CORS issues needed manual proxy configuration
- **State Management**: Complex interdependencies required careful planning

---

**This documentation reflects the actual architecture of the AI-generated application. The technical decisions were made through conversational AI development, demonstrating the sophistication possible with AI-assisted coding.**