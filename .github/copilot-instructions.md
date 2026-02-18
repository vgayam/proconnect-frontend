<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# ProConnect - Professional Services Discovery Platform

This is a Next.js 14 TypeScript project with Tailwind CSS for a professional services discovery platform.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css         # Global styles and Tailwind
│   ├── layout.tsx          # Root layout with Header/Footer
│   ├── page.tsx            # Home page
│   ├── not-found.tsx       # 404 page
│   └── professionals/      # Professional-related pages
│       ├── page.tsx        # Listing/search page
│       └── [id]/           # Dynamic profile page
│
├── components/
│   ├── ui/                 # Reusable UI components (Button, Card, Input, etc.)
│   ├── features/           # Feature-specific components (ProfessionalCard, SearchBar)
│   └── layout/             # Layout components (Header, Footer)
│
├── lib/
│   ├── utils.ts            # Utility functions (cn, formatters)
│   └── data.ts             # Mock data (replace with API calls)
│
└── types/
    └── index.ts            # TypeScript type definitions
```

## Key Conventions

1. **Types First**: All data structures are defined in `src/types/index.ts`
2. **Barrel Exports**: Each component folder has an `index.ts` for clean imports
3. **Client Components**: Use `"use client"` directive only when needed (state, effects)
4. **Mock Data**: Located in `src/lib/data.ts` - replace with actual API calls

## Common Tasks for Backend Engineers

### Adding a New API Endpoint Integration

1. Create API client in `src/lib/api.ts`
2. Replace mock data functions in `src/lib/data.ts` with API calls
3. Types are already defined in `src/types/index.ts`

### Adding a New Page

1. Create folder in `src/app/` (e.g., `src/app/about/page.tsx`)
2. Use existing components from `src/components/ui` and `src/components/features`

### Modifying Styles

- Colors are defined in `tailwind.config.ts`
- Global styles in `src/app/globals.css`
- Component-specific styles use Tailwind classes inline

## Running the Project

```bash
npm install        # Install dependencies
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
```
