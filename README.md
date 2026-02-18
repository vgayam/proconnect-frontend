# ProConnect - Professional Services Discovery Platform

A modern, production-ready platform for discovering and connecting with skilled professionals. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Professional Profiles**: View detailed profiles with skills, services, social links, and ratings
- **Search & Filter**: Find professionals by name, skill, location, or availability
- **Contact System**: Easy-to-use contact forms for reaching out to professionals
- **Responsive Design**: Beautiful UI that works on all devices
- **Type-Safe**: Full TypeScript support for maintainability

## 📁 Project Structure

```
pro-connect/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── not-found.tsx       # 404 page
│   │   └── professionals/      # Professional pages
│   │       ├── page.tsx        # Search/listing
│   │       └── [id]/           # Profile detail
│   │
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx      # Button with variants
│   │   │   ├── Card.tsx        # Card container
│   │   │   ├── Input.tsx       # Form input
│   │   │   ├── Badge.tsx       # Tags/badges
│   │   │   ├── Avatar.tsx      # User avatars
│   │   │   ├── Modal.tsx       # Modal dialogs
│   │   │   └── index.ts        # Barrel export
│   │   │
│   │   ├── features/           # Feature components
│   │   │   ├── ProfessionalCard.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── ContactModal.tsx
│   │   │   ├── SocialLinks.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── layout/             # Layout components
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── index.ts
│   │
│   ├── lib/
│   │   ├── utils.ts            # Utility functions
│   │   └── data.ts             # Mock data (replace with API)
│   │
│   └── types/
│       └── index.ts            # TypeScript definitions
│
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🎨 Customization

### Colors

Edit the primary and secondary colors in `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    500: "#0ea5e9",  // Main brand color
    // ... other shades
  },
  secondary: {
    500: "#d946ef",  // Accent color
    // ... other shades
  },
}
```

### Adding Real Data

Replace the mock data in `src/lib/data.ts` with your API calls:

```typescript
// Example: Replace getProfessionalById
export async function getProfessionalById(id: string): Promise<Professional | null> {
  const response = await fetch(`/api/professionals/${id}`);
  return response.json();
}
```

## 📦 Key Dependencies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS
- **Lucide React**: Beautiful icons
- **class-variance-authority**: Component variants
- **clsx + tailwind-merge**: Conditional class handling

## 🔧 For Backend Engineers

This project is designed to be maintainable by backend engineers with minimal frontend experience:

1. **Types are centralized**: All data structures in `src/types/index.ts`
2. **Components are documented**: JSDoc comments explain usage
3. **Mock data is separate**: Easy to swap with real API calls
4. **Folder structure is logical**: Feature-based organization

### Common Tasks

| Task | Location |
|------|----------|
| Add new data type | `src/types/index.ts` |
| Connect to API | `src/lib/data.ts` |
| Add new page | `src/app/[folder]/page.tsx` |
| Add UI component | `src/components/ui/` |
| Modify styles | `tailwind.config.ts` or component |

