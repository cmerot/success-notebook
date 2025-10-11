# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **success-notebook** application built with Tauri v2 + SvelteKit + TypeScript. It's a desktop application that combines a Rust backend with a modern web frontend, running as a Single Page Application (SPA) in SPA mode.

## Architecture

### Frontend (SvelteKit SPA)
- **Build System**: SvelteKit with `@sveltejs/adapter-static` in SPA mode (fallback to index.html)
- **Styling**: Tailwind CSS 4 with shadcn-svelte component library
- **UI Library**: shadcn-svelte with base color "slate" and `tw-animate-css` for animations
- **Dev Server**: Vite running on port 1420 (fixed port required by Tauri)
- **HMR**: Port 1421 for hot module replacement

### Backend (Tauri + Rust)
- **Framework**: Tauri v2 with Rust backend
- **Library Structure**: `success_notebook_lib` crate with both library and binary targets
- **Commands**: Rust commands exposed via `#[tauri::command]` macro and registered in `invoke_handler`
- **Plugins**: Currently using `tauri-plugin-opener`

### Communication Pattern
Frontend calls backend via `invoke()` from `@tauri-apps/api/core`:
```typescript
import { invoke } from "@tauri-apps/api/core";
const result = await invoke("command_name", { param: value });
```

Backend commands are defined in `src-tauri/src/lib.rs` and registered in the builder.

## Development Commands

### Running the Application
```bash
# Development mode (starts both Vite dev server and Tauri)
bun run tauri dev

# Frontend only (for UI development without Tauri)
bun run dev
```

### Building
```bash
# Build the application for production
bun run tauri build

# Build frontend only
bun run build
```

### Type Checking
```bash
# Run Svelte type checking
bun run check

# Run type checking in watch mode
bun run check:watch
```

### Adding UI Components
```bash
# Add shadcn-svelte components
bunx shadcn-svelte@latest add [component-name]
```

## Path Aliases

Configured in `components.json` for shadcn-svelte:
- `$lib` → `src/lib` (SvelteKit default)
- `$lib/components` → Component directory
- `$lib/components/ui` → shadcn-svelte UI components
- `$lib/utils` → Utility functions (includes `cn()` for Tailwind class merging)
- `$lib/hooks` → Custom hooks directory

## Key Configuration Files

### Frontend Configuration
- `vite.config.js`: Tailwind CSS plugin, SvelteKit plugin, fixed port 1420, HMR on 1421
- `svelte.config.js`: Static adapter with index.html fallback for SPA mode
- `src/app.css`: Tailwind imports, custom CSS variables for theming (light/dark mode), shadcn-svelte theme configuration

### Backend Configuration
- `src-tauri/tauri.conf.json`: Tauri app configuration, window settings, bundle options
- `src-tauri/Cargo.toml`: Rust dependencies, crate configuration with `_lib` suffix to avoid naming conflicts on Windows

## File Structure Conventions

### Frontend
- `src/routes/+page.svelte`: Page components (SvelteKit routing)
- `src/routes/+layout.svelte`: Layout wrapper (imports app.css globally)
- `src/lib/components/ui/`: shadcn-svelte components
- `src/lib/components/`: Custom reusable components
- `src/lib/utils.ts`: Utility functions including `cn()` for class merging

### Backend
- `src-tauri/src/lib.rs`: Main application logic, Tauri commands, plugin registration
- `src-tauri/src/main.rs`: Entry point that calls `success_notebook_lib::run()`

## Important Architecture Notes

1. **SPA Mode Required**: This app uses `adapter-static` with fallback to index.html because Tauri doesn't support SSR. All routes must be client-side.

2. **Fixed Ports**: Vite dev server runs on port 1420 (strictPort: true). If port is unavailable, the dev server will fail rather than use an alternative.

3. **Rust Command Registration**: When adding new Tauri commands:
   - Define in `src-tauri/src/lib.rs` with `#[tauri::command]`
   - Register in `.invoke_handler(tauri::generate_handler![command1, command2])`

4. **Theming**: The app uses CSS custom properties with OKLCH color space for both light and dark modes. Theme variables are defined in `src/app.css`.

5. **Svelte 5**: This project uses Svelte 5 with runes syntax (`$state`, `$props`, `$derived`, etc.).

## Package Manager

This project uses **Bun** as the package manager. Use `bun install`, `bun add`, etc. for dependency management.
