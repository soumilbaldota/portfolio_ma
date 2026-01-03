# Copilot Instructions for Portfolio Application

## Project Overview

This is a personal portfolio website built with Next.js 16.1.0, React 19, and TypeScript. The application features a desktop-like interface with folder icons that open modal windows to display different sections (About, Work, Projects, Contact).

## Technology Stack

- **Framework**: Next.js 16.1.0 (App Router)
- **UI Library**: React 19.2.3
- **Language**: TypeScript 5 (strict mode enabled)
- **Styling**: Tailwind CSS 4
- **Icons**: lucide-react
- **Linter**: ESLint with Next.js configuration

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
app/
├── Contact.tsx      # Contact modal content
├── Modal.tsx        # Reusable modal component
├── Projects.tsx     # Projects modal content
├── folder.tsx       # Folder icon component
├── globals.css      # Global styles with Tailwind
├── layout.tsx       # Root layout component
└── page.tsx         # Main page with modal management
```

## Coding Conventions

### React Components

- Use **client components** (`"use client"` directive) for interactive UI
- Prefer **named exports** for reusable components
- Use **default export** for page components
- Component file names use PascalCase (e.g., `Contact.tsx`, `Modal.tsx`)

### TypeScript

- Strict mode is enabled - all types must be properly defined
- Use `React.ReactNode` for component children and content
- Define proper interfaces for component props
- Target ES2017 for compilation

### State Management

- Use React hooks (`useState`, `useEffect`) for component state
- Keep modal state management centralized in the main page component
- Pass callbacks as props for child-to-parent communication

### Styling

- Use **Tailwind CSS** utility classes for all styling
- Follow Tailwind 4 syntax and conventions
- Custom colors and theme values defined in `globals.css`
- Prefer utility classes over custom CSS

### Import Conventions

- Use relative imports for local components (e.g., `./folder`, `./Modal`)
- Named imports for React hooks and utilities
- Path aliases: `@/*` maps to root directory

### Component Patterns

- Modal components receive `onClose`, `onMinimize`, `onMaximize` callbacks
- Use boolean flags for UI state (`isMinimized`, `isMaximized`)
- Implement restore functionality when clicking minimized modals

## Code Quality

- All code must pass ESLint checks
- Follow Next.js and React best practices
- Maintain type safety with TypeScript strict mode
- Ensure accessibility for interactive elements

## Testing

Currently, this project does not have automated tests. When adding features, focus on:
- Manual testing of interactive elements
- Cross-browser compatibility
- Responsive design verification

## UI/UX Guidelines

- Desktop-like interface with folder icons
- Modal windows for different content sections
- Support minimize, maximize, and close operations
- Visual indicators for minimized modals
- Responsive layout with proper overflow handling
- Backdrop blur effects for visual depth

## Performance Considerations

- Use Next.js 16 features and optimizations
- Implement proper code splitting
- Optimize images using Next.js Image component where appropriate
- Keep client-side bundle size minimal

## Common Tasks

### Adding a New Modal Section

1. Create content component in `app/` directory
2. Import component in `page.tsx`
3. Add case to `openPortal` switch statement
4. Add `FolderIconWithImage` component to the UI
5. Update type union for `activeModal` state

### Modifying Styles

1. Use Tailwind utility classes first
2. Only add custom CSS to `globals.css` for theme-level changes
3. Follow existing color scheme and spacing conventions

### Adding New Dependencies

- Check if functionality exists in current dependencies
- Prefer lightweight packages
- Ensure compatibility with Next.js 16 and React 19
- Run security audit before adding new packages
