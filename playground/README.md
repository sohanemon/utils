# Sohanemon Utils Playground

A Vite-based playground for testing and exploring the Sohanemon Utils React library components and hooks.

## Features

This playground demonstrates:

- **Components:**
  - `ResponsiveIndicator` - Shows current responsive breakpoint
  - `ScrollTracker` - Provides scroll tracking context
  - `ScrollableMarker` - Automatically marks scrollable elements

- **Hooks:**
  - `useMediaQuery` - Responsive breakpoint detection
  - `useDebounce` - Debounced state updates
  - `useLocalStorage` - Persistent local storage state
  - `useCopyToClipboard` - Clipboard operations with feedback
  - `useIsScrolling` - Scroll activity detection
  - `useIsAtTop` - Top position detection
  - `useIntersection` - Intersection Observer API

## Getting Started

### Option 1: From the root directory
```bash
npm run playground
```

### Option 2: Manual setup
1. Install dependencies:
   ```bash
   cd playground
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

## Development

The playground imports components and hooks directly from the local source code, so changes to the main library will be reflected immediately in the playground.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build