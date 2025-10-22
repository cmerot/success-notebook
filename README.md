# Success notebook

A cross-platform notebook application built with Tauri and SvelteKit.

## Technical Stack

This application is built with:

- **[Tauri](https://tauri.app/)**: A framework for building lightweight, secure desktop and mobile applications using web technologies. Tauri provides native functionality while keeping the app size small.
- **[SvelteKit](https://kit.svelte.dev/)**: A framework for building web applications with Svelte. It provides routing, server-side rendering capabilities, and a great developer experience.
- **[TailwindCSS](https://tailwindcss.com/)**: For styling
- **Additional UI libraries**: bits-ui, shadcn-svelte components, lucide icons

### SvelteKit Configuration

The application uses the **SvelteKit static adapter** (`@sveltejs/adapter-static`) to generate static HTML, CSS, and JavaScript files. This is required for Tauri, which serves the application from static files rather than running a Node.js server.

### Tauri Plugins

The application uses several Tauri plugins to access native functionality:

- **plugin-store**: Key-value storage for persistent application data
- **plugin-fs**: File system operations for reading and writing files
- **plugin-dialog**: Native dialog boxes (open, save, message dialogs)
- **plugin-opener**: Opens URLs and files with the system's default applications

### Permissions

The application requires the following permissions (configured in `src-tauri/capabilities/default.json`):

- `core:default` - Core Tauri functionality
- `opener:default` - Opening URLs and files
- `store:allow-*` - Full access to the store plugin (load, set, get, save, entries, delete, clear)
- `dialog:default` - Native dialogs
- `fs:default` - Basic file system operations
- `fs:allow-app-write` - Write access to the application data directory

### Local Storage

The application uses an **adapter pattern** for storage, allowing it to work seamlessly on different platforms:

- **Desktop/Android (Tauri)**: Uses the `@tauri-apps/plugin-store` which persists data in a JSON file named `success-notebook.json` in the application's data directory
- **Web (Browser)**: Uses **IndexedDB** with a database named `success-notebook` for persistent browser-based storage

Both storage adapters implement the same interface, providing a unified API for storing notebook entries, user preferences, and application state across all platforms.

## Development

### SvelteKit Dev Server

To run the web application in development mode:

```bash
bun run dev
```

The dev server will start at `http://localhost:1420` (or another port if 1420 is in use) with hot module reloading enabled.

### Tauri Android Development

To run the application on Android (requires Android SDK and NDK setup):

```bash
bunx tauri android dev
```

This will build the app and deploy it to a connected Android device or emulator.

## Building

### Web Build

To build the SvelteKit application for production:

```bash
bun run build
```

The static output will be generated in the `build/` directory.

### Android Build

To build the Android APK:

```bash
bunx tauri android build --target aarch64
```

For other Android architectures:

- `armv7` - ARMv7 (older devices)
- `aarch64` - ARM64 (modern devices)
- `x86` - x86 (emulators)
- `x86_64` - x86_64 (emulators)

The APK will be generated in `src-tauri/gen/android/app/build/outputs/apk/`.

## Navigation principle

This app has 4 pages:

- Notebook : summary about the selected date per day, week and month
- Notebook/day: details about the selected day
- Notebook/week: details about the selected week
- Notebook/month: details about the selected month

Also:

- Homepage is the Notebook at today's date, lives at `/`
- Notebook is available at any date under `/YYYY/MM/DD`
- Forms live at `/YYYY/MM/DD/{day, week, month}`

### Behaviours

- Homepage has a burger menu
- All other pages have a back button, which is a simple `history.back()`
  for compatibility with devices' backward navigation
- On any details page the back button goes to the Notebook
- On any Notebook the back button goes to the Homepage
- A calendar in the app header let the user navigates to any Notebook

### Navigation sequences

| STATUS | SOURCE     | TARGET     | HISTORY STATE       | NAV                     |
| ------ | ---------- | ---------- | ------------------- | ----------------------- |
| ok     | today      | today/form | [today, today/form] | regular link            |
| ok     | today/form | date2      | [today, date2]      | goto(replaceState=true) |
| ok     | date2      | date3      | [today, date3]      | goto(replaceState=true) |

| STATUS | SOURCE     | TARGET     | HISTORY STATE              | NAV                                                 |
| ------ | ---------- | ---------- | -------------------------- | --------------------------------------------------- |
| ok     | today      | date2      | [today, date2]             | goto(replaceState=false) (because coming from home) |
| ok     | date2      | date2/form | [today, date2, date2/form] | regular link                                        |
| not ok | date2/form | date3      | [today, date2, date3]      | goto(replaceState=true)                             |
| ok     | date3      | date4      | [today, date2, date4]      | goto(replaceState=true)                             |

Since we cannot intercept device's `history.back`, the trick is to detect
when user is going from `date2/form` to `date3` and force a `history.back(-1)` followed by a regular `goto(replaceState=true)`. It's implemented in `date-picker.svelte`
